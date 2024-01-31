var cswitch = {database : 0, papers : 0, projects : 0, software : 0, talks : 0}
var categorias; // Selected categories

/* @input id: selects a certain cateogory, and proceeds to display the related results.*/
function divswitch(id) 
{
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
});
cswitch[id] = 1 - cswitch[id];
var sum = 0
Object.keys(cswitch).forEach(function(key) { sum += cswitch[key] })

if (sum == 0 || sum == 5) {
  Object.keys(cswitch).forEach(function(key) {
    d3.selectAll('#' + key).transition()
	.style('display','block')
    }) ;
  } else {
  Object.keys(cswitch).forEach(function(key) {
    d3.selectAll('#' + key).transition()
	.style('display',(cswitch[key] == 1?'block':'none'))
    })
  }
}

function pub(id,width)
{
d3.json("assets/data/proyects.json", function(error, data) {
  if (error) throw error;

var len = 0;
var c = {projects : 0, papers : 0, talks : 0, software : 0, database : 0};
var projects  = [];
var year = 0;
var ids = {};

for (a in data)
  {

    data[a].place = data[a].description;
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
    data[a].key = 'papers';
    c[data[a].key] += 1;
    }
  else if (data[a].key === "incollection")
    {
    data[a].key = 'papers';
    c[data[a].key] += 1;
    }
  else if (data[a].key === "report")
    {
    data[a].key = 'papers';
    c[data[a].key] += 1;
    }
  else if (data[a].key ===  "inproceedings")
    {
    data[a].key = 'talks';
    c[data[a].key] += 1;
    }
  else if (data[a].key === "projects")
    {
    data[a].title = 'Project: ' + data[a].title;
    projects.push(a);
    c[data[a].key] += 1;
    }
  else if (data[a].key === "software")
    {
    c[data[a].key] += 1;
    projects.push(a);
    }
  else if (data[a].key === "database")
    {
    c[data[a].key] += 1;
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

let listElements=document.querySelectorAll('.dropdown')

listElements.forEach(listElement=>{
   listElement.addEventListener('click',()=>{
      listElement.classList.toggle('arrow')

      let height=0
      let menu=listElement.nextElementSibling
      if(menu.clientHeight=="0"){
        height=menu.scrollHeight
      }
      menu.style.height= `${height}px`
   })
})

const params = new URLSearchParams(window.location.search);
const contenidoId = params.get('id');
const filteredData = data.filter(item => {

  const itemId = item.link.split('=')[1];
  return itemId === contenidoId;
});
 iddata=filteredData
content = div.append('div')
.attr('class','col-12')


function updateVisualization(filteredResults) {
  content.html('');   
  const filteredatalen=filteredResults.length

for (i = filteredatalen - 1; i >= 0; i--)
 {
 var paper = content.append('div')
      .attr('class','single-blog-grid grilla')
      .attr('id',filteredResults[i].key) 
      .append('div')
 .attr('class','blog-content')
   .append('div')
   .attr('class','row')

 paper.append('div')
   .attr('class','col-11')
     .append('h4')
     .attr('class','resources')
       .append('a')
             .attr('href',filteredResults[i].link)
             .html(filteredResults[i].title)




if (filteredResults[i].key === 'projects' || filteredResults[i].key === 'software') {
   paper.append('div')
     .attr('class','col-6')
  .append('div')
    .attr('class','meta-info')
       .append('a')
       .attr('class','date')
       .attr('href',filteredResults[i].link)
       .html('<i class="lni lni-timer"></i>' + ((filteredResults[i].end > 1)?'Inactive: ' + filteredResults[i].begin + '-' + filteredResults[i].end:'Active: ' + filteredResults[i].begin + ' - today'))
} 
       
fila=paper.append('div')
   .attr('class','row org')
   
   
fila.append('div')
     .attr('class','col-4')
     .html("<strong>Organization: </strong><a href=" + filteredResults[i].orgurl+">" + filteredResults[i].org+ "</a>")
   
   
fila.append('div')
     .attr('class','col-4')
     .html("<p style='text-align:right;'><strong>Year: </strong>" + filteredResults[i].year + ".</p>")  

fila.append('div')
      .attr('class','col-4')
      .html("<strong> Integrantes: </strong>" +" "+filteredResults[i].author) 
    
var descriptionRow = paper.append('div')
      .attr('class', 'row org');

text= descriptionRow.append('div')
      .attr('class', 'col-12 description')
      
text.append('iframe')
      .attr('class','content')
      .attr('src',iddata[0].html)

var iframe = document.querySelector('.content');

iframe.onload = function() {
    var contentHeight = this.contentWindow.document.body.scrollHeight + 30;

    this.style.height = contentHeight +'px'
};

txt = paper.append('div')
      .attr('class', 'col-12');

txt.append('p')
      .html(filteredResults[i].desc);
}
 }

updateVisualization(iddata)

})}