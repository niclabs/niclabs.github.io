function pub(id,width)
{
d3.json("data/bib.json", function(error, data) {
  if (error) throw error;

data.sort(function(a,b) {return d3.ascending(a.year,b.year);});

var j = 0;
var c = 0;
var r = 0;
var b = 0;

var len = 0;
for (a in data)
  {
  if (data[a].key === "article")
    {
    j++;
    data[a].li = 'j' + j;
    }
  else if (data[a].key === "incollection")
    {
    b++;
    data[a].li = 'b' + b;
    }
  else if (data[a].key ===  "inproceedings")
    {
    c++;
    data[a].li = 'c' + c;
    }
  else
    {
    r++;
    data[a].li = 'r' + r;
    }
  len++;
  }

var year = data[len-1].year+1;
var div = d3.select('#'+id)
            .style('align-content','center')

for (i = len - 1; i >= 0; i--)
  {
  if (data[i].year < year)
    {
    year = data[i].year;
    var div2 = div.append('div')
       .attr('class','col-sm-12')
       .append('h2')
         .attr('class','sub_title')

    div2.append('i')
       .attr('class','fa fa-file-text-o')
       .attr('aria-hidden','true')

    div2.html(year)
    }
   
  var paper = div.append('div')
     .attr('class','year_detail')

  paper.append('tt')
       .html('[' + data[i].li + '] ')

  paper.append('a')
       .attr('href',data[i].link)
       .html('"' + data[i].title +'"')

  var txt = data[i].author + ". <tt>In ";

  if (data[i].key == 'article' || data[i].key == 'incollection')
    {
    txt += (data[i].key == 'article')? data[i].journal:data[i].booktitle;
    txt += (typeof data[i].volume !== 'undefined')? ': '+data[i].volume:'';
    txt += (typeof data[i].number !== 'undefined')? '('+data[i].number+')':'';
    txt += '. '
    }	
  else if (data[i].key == 'inproceedings')
    {
    txt += ('Proceedings of '+data[i].booktitle+'. ')
    }
    txt +=(data[i].publisher+ '. ')
    txt += (typeof data[i].pages !== 'undefined')? 'Pages '+data[i].pages+'.':'';
  paper.append('p').html(txt)
  }
})
}
