function phi(id,width,height) 
{
var phi = 21.0/13.0;
var color = d3.scaleOrdinal(d3.schemeCategory10);
var color = ['#343545','#38A1E4','#C8E0EE','#31647E','#0B3246','#85C3CF','#7FA6B6','white']
var fib = [21,13,8,5,3,2,1,1];
var a = 0;

width = width - 20;
height = height - 20;

if (width > height)
  {
  if (width/height > phi)
    {
    width = Math.round(phi * height);
    }
  else
    {
    height = Math.round(width / phi);
    }
  a = Math.round(width);
  }
else
  {
  if (height/width > phi)
    {
    height = Math.round(phi * width);
    }
  else
    {
    width = Math.round(height / phi);
    }
  a = Math.round(height);
  }

d3.selectAll('#' + id)
  .append('div')
  .style('width', width + "px")
  .style('height', height + "px")
  .style('background-color', color[0])
  .attr('id', id + 'div0b');

for (i=1; i <= 3; i++)
  {
  var divid = id + 'div' + (i-1) + 'b';
  var pw = Math.round(document.getElementById(divid).clientWidth);
  var ph = Math.round(document.getElementById(divid).clientHeight);

  var side = Math.round(1.0 * fib[i] * a / 21.0);

  d3.selectAll('#' + id + 'div' + (i-1) + 'b')
    .append('div')
    .style('width', ((pw - side > 1)? pw - side : side) + 'px')
    .style('height',((ph - side > 1)? ph - side : side) + 'px')
    .style('float', (i != 3)?'left':'right')
    .attr('id', id + 'div' + i + 'b')

  d3.selectAll('#' + id + 'div' + (i-1) + 'b')
    .append('div')
    .style('width', side + 'px')
    .style('height', side + 'px')
    .style('float', (i == 3)?'left':'right')
    .attr('id', id + 'div' + i + 'a')
    .style('background-color', color[i - 1])
 
  }

for (i=4; i <= 7; i++)
  {
  var divid = id + 'div' + (i-1) + 'b';
  var pw = Math.round(document.getElementById(divid).clientWidth);
  var ph = Math.round(document.getElementById(divid).clientHeight);

  var side = Math.round(1.0 * fib[i] * a / 21.0);

  d3.selectAll('#' + id + 'div' + (i-1) + 'b')
    .append('div')
    .style('width', side + 'px')
    .style('height', side + 'px')
    .style('float', (i != 5)?'left':'right')
    .attr('id', id + 'div' + i + 'a')
    .style('background-color', color[i - 1])
 
  d3.selectAll('#' + id + 'div' + (i-1) + 'b')
    .append('div')
    .style('width', ((pw - side > 1)? pw - side : side) + 'px')
    .style('height',((ph - side > 1)? ph - side : side) + 'px')
    .style('float', (i == 5)?'left':'right')
    .attr('id', id + 'div' + i + 'b')

  }
}
