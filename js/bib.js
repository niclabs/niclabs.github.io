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
    div.append('div')
       .style('width', width + "px")
       .style('text-align','center')
       .html('<tt>'+year+'</tt>')
    }
   
  var paper = div.append('div')
     .style('width', 0.95 * width + "px")
     .style('text-align','left')
     .style('font', '10pt')
     .html('<p>')

  paper.append('tt')
       .html('<span style="color: white;">[' + data[i].li + ']</span> ')
       .append('a')
       .attr('href',data[i].link)
       .html('"' + data[i].title +'"')

  paper.append('tt')
       .html(". " + data[i].author + ". ")

  if (data[i].key == 'article' || data[i].key == 'incollection')
    {
    var txt = (data[i].key == 'article')? data[i].journal:data[i].incollection;
    txt += (typeof data[i].volume !== 'undefined')? ': '+data[i].volume:'';
    txt += (typeof data[i].number !== 'undefined')? '('+data[i].number+')':'';
    txt += '. '
    paper.append('tt')
       .html('In ' + txt)
    }	
  else if (data[i].key == 'inproceedings')
    {
    paper.append('tt')
       .html('Proceedings of '+data[i].booktitle+'. ')
    }
  paper.append('tt')
       .html(data[i].publisher+ '. ')
  var txt = (typeof data[i].pages !== 'undefined')? 'Pages '+data[i].pages+'.</p>':'</p>';
  paper.append('tt').html(txt)
  }
})
}
