var cswitch = {database : 0, papers : 0, projects : 0, software : 0, talks : 0}

function divswitch(id) 
{
cswitch[id] = 1 - cswitch[id];
var sum = 0
Object.keys(cswitch).forEach(function(key) { sum += cswitch[key] })

if (sum == 0 || sum == 5) {
  Object.keys(cswitch).forEach(function(key) {
    d3.selectAll('#' + key).transition()
	.style('display','block')
    })
  } else {
  Object.keys(cswitch).forEach(function(key) {
    d3.selectAll('#' + key).transition()
	.style('display',(cswitch[key] == 1?'block':'none'))
    })
  }
}

function pub(id,width)
{
d3.json("assets/data/bib.json", function(error, data) {
  if (error) throw error;

var len = 0;
var c = {projects : 0, papers : 0, talks : 0, software : 0, database : 0};
var projects  = [];
var year = 0;
var ids = {};

for (a in data)
  {
  if (data[a].hasOwnProperty('year') && data[a].year > year) 
    {
    year = data[a].year;
    }
  if (data[a].hasOwnProperty('id'))
    {
    myid = (data[a].id).split(".");
    if (!ids.hasOwnProperty(myid[0])) ids[myid[0]] = [];
    ids[myid[0]][myid[1]] = data[a];
    }
  if (data[a].key === "article")
    {
    data[a].place = data[a].journal;
    data[a].place += data[a].hasOwnProperty('volume')? ': '+data[a].volume:'';
    data[a].place += data[a].hasOwnProperty('number')? '('+data[a].number+')':'';
    data[a].place += ', ' + (data[a].publisher+ '. ');
    data[a].place += '. ' + data[a].hasOwnProperty('pages')? 'Pages '+data[a].pages+'.':'';
    data[a].icon = 'assets/images/repository/papers.png';
    data[a].key = 'papers';
    c[data[a].key] += 1;
    }
  else if (data[a].key === "incollection")
    {
    data[a].place = data[a].booktitle;
    data[a].place += data[a].hasOwnProperty('volume')? ': '+data[a].volume:'';
    data[a].place += data[a].hasOwnProperty('number')? '('+data[a].number+')':'';
    data[a].place += '. ' + data[a].hasOwnProperty('pages')? 'Pages '+data[a].pages+'.':'';
    data[a].place += ', ' + (data[a].publisher+ '. ');
    data[a].icon = 'assets/images/repository/papers.png';
    data[a].key = 'papers';
    c[data[a].key] += 1;
    }
  else if (data[a].key === "report")
    {
    data[a].place = data[a].publisher;
    data[a].icon = 'assets/images/repository/papers.png';
    data[a].key = 'papers';
    c[data[a].key] += 1;
    }
  else if (data[a].key ===  "inproceedings")
    {
    data[a].place = 'Proceedings of ' + data[a].booktitle;
    data[a].place += ', ' + (data[a].publisher+ '. ');
    data[a].place += data[a].hasOwnProperty('pages')? 'Pages '+data[a].pages+'.':'';
    data[a].icon = 'assets/images/repository/talks.png';
    data[a].key = 'talks';
    c[data[a].key] += 1;
    }
  else if (data[a].key === "projects")
    {
    data[a].place = data[a].link;
    data[a].title = 'Project: ' + data[a].title;
    data[a].icon = 'assets/images/repository/projects.png';
    projects.push(a);
    c[data[a].key] += 1;
    }
  else if (data[a].key === "software")
    {
    data[a].icon = 'assets/images/repository/software.png';
    c[data[a].key] += 1;
    projects.push(a);
    }
  else if (data[a].key === "database")
    {
    data[a].icon = 'assets/images/repository/database.png';
    c[data[a].key] += 1;
    }
  else 
    {
    data[a].place ="";
    }      
  len++;
  }

for (i = 0; i < c['projects'] + c['software']; i++)
  {
  a = projects[i];
  data[a].year = data[a].hasOwnProperty('end')? data[a].end : year;
  }

data.sort(function(a,b) {
  if (a.year == b.year) {
    if (a.key == b.key) {
      if (a.hasOwnProperty('place') && b.hasOwnProperty('place'))
      return -1;
      else return 1;
    }
  else return (a.key === 'projects' || a.key === 'software')? 1 : (a.key < b.key)? 1 : -1;
  }
  else return (a.year < b.year)? -1 : 1;
});

var div = d3.select('#'+id)

// sidebar

sidebar = div.append('div')
   .attr('class','col-3')
   .append('div')
      .attr('class','sidebar')
      .append('div')
  .attr('class','widget search-widget')
  
sidebar.append('h5')
  .attr('class','widget-title')
  .html('Filtros')
	
sbody = sidebar.append('div')
    .attr('class','sidebar__section')
    .append('div')
      .attr('class','sidebar__body')

Object.keys(cswitch).forEach(function(key) {
    fil = sbody.append('div')
	   .attr('class','sidebar__filter')
	   .append('label')

    fil.append('input')
	    .attr('type','checkbox')
	    .attr('name',key)
	    .attr('onclick','divswitch("'+key+'")')
    fil.append('img')
	      .attr('class','sidebar__filter-image')
	      .attr('src','assets/images/repository/' + key + '.png')
    fil.append('span')
	      .attr('class','sidebar__filter-count')
	      .html(c[key]+"&nbsp; ")
    fil.append('span')
	      .attr('class','sidebar__filter-type')
	      .html(key)
})
// content

content = div.append('div')
   .attr('class','col-9')

for (i = len - 1; i >= 0; i--)
  {
  var paper = content.append('div')
       .attr('class','single-blog-grid')
       .attr('id',data[i].key)
       .append('div')
  .attr('class','blog-content')
    .append('div')
    .attr('class','row')

  paper.append('div')
    .attr('class','col-11')
      .append('h4')
      .attr('class','resources')
        .append('a')
              .attr('href',data[i].link)
              .html(data[i].title)

  paper.append('div')
    .attr('class','col-1')
    .append('img')
      .attr('class','tag')
      .attr('src',data[i].icon)

 if (data[i].key === 'projects' || data[i].key === 'software') {
    paper.append('div')
      .attr('class','col-6')
   .append('div')
     .attr('class','meta-info')
        .append('a')
        .attr('class','date')
        .attr('href',data[i].link)
        .html('<i class="lni lni-timer"></i>' + ((data[i].end > 1)?'Inactive: ' + data[i].begin + '-' + data[i].end:'Active: ' + data[i].begin + ' - today'))
 } else {
    paper.append('div')
      .attr('class','col-6')
         .append('div')
           .attr('class','meta-info')
              .append('a')
        .attr('class','date')
        .attr('href',data[i].link)
              .html('<i class="lni lni-pin"></i>' + data[i].place)
 }
        
  paper.append('div')
    .attr('class','col-6')
    .append('div')
      .attr('class','org')
      .html("<strong>Organization: </strong><a href=" + data[i].orgurl+">" + data[i].org + "</a><p style='text-align:right;'><strong>Year: </strong>" + data[i].year + ".</p>")

  txt = paper.append('div')
    .attr('class','col-12')

  txt.append('p')
    .html(data[i].desc)

  txt.append('p')
    .html(data[i].author)

// recursos asociados

  if (data[i].hasOwnProperty('id')) {
    myid = (data[i].id).split(".");
    if (myid[1] == '0') {
      myc = {database : 0, papers : 0, projects : 0, software : 0, talks : 0}
      myn = 0
        
      Object.keys(ids[myid[0]]).forEach(function(key) {
        if (key != '0') {
          myn += 1
          myc[ids[myid[0]][key]['key']] += 1;
          }
        })

      if (myn > 0) {
	ids[myid[0]].sort(function(a,b) {
          return (a.year < b.year)? 1 : -1;
        })

        ppr = paper.append('div')
                   .attr('class','col-9')
	ppr.append('br')           
        ppr.append('strong').html('Resources:');

        Object.keys(ids[myid[0]]).forEach(function(key) {
          if (ids[myid[0]][key]['key'] !== 'projects') {
	    divppr = ppr.append('div').append('li')
            divppr.html('<a href=' + ids[myid[0]][key]['link'] + ' style="display:inline;">' +
                                     ids[myid[0]][key]['title'] +
	                             ' (' + 
			  ids[myid[0]][key]['place'] + ', ' +
			  ids[myid[0]][key]['year'] + ')')
            }
          })
	ppr2 = paper.append('div')
	            .attr('class','col-3')
	  res = ppr2.append('div')
		    .attr('class','org')
	        res.append('br')
		res.append('strong')
		   .html('Resources per type:')
	  divres = res.append('div')
		     .attr('class','sidebar__filter')

	Object.keys(myc).forEach(function(key) {
		if (myc[key] > 0) {
		  divres.append('img')
			.attr('class','sidebar__filter-image')
			.attr('src','assets/images/repository/'+key+'.png')
		  divres.append('span')
			.attr('class','sidebar__filter-type')
			.html(myc[key])
		}
	  })
        }
	  
      }
    }
}
  })
}
