function fullpeople(w)
{
d3.json("data/people.json", function(error, data) {
  if (error) throw error;

  data.sort(function(a,b) {return d3.ascending(a.last,b.last);});
  var h = {};

  h['r'] = data.filter(function f(d) {return d.group == 'researcher';});
  h['p'] = data.filter(function f(d) {return d.group == 'pro';});
  //h['e'] = data.filter(function f(d) {return d.group == 'external';});
  h['s'] = data.filter(function f(d) {return d.group == 'grad';});
  h['u'] = data.filter(function f(d) {return d.group == 'under';});
  h['a'] = data.filter(function f(d) {return d.group == 'alumni';});

  for (var k in h) {
    var div = d3.select('#'+h[k][0].group)
            .selectAll('div')
            .data(h[k])
            .enter()
              .append('div')
              .style('width' , (w / 3) + 'px' )
              .style('float' , 'left')
              .style('margin-bottom' , (w / 10) + 'px')
              .style('align-content','center')
              .attr('class' , 'tooltip')
             
  div.append("a")
     .attr("href",function f(d) {
       if (d.www != "") return d.www; 
       if (d.github != "") return "http://www.github.com/"+d.github;
       if (d.twitter != "") return "http://www.twitter.com/"+d.twitter; 
       return '#';
     })
     .append("img")
     .attr('src',function f(d) { return d.picurl; })
     .style('width', (w / 4) + 'px')
     .style('height', (w / 4) + 'px')
     .style('filter', 'gray')
     .style('-webkit-filter', 'grayscale(1)')

    div.append('div')
     .attr('class','tooltiptext')
     .style('width', (w / 4) + 'px')
     .html(function f(d) { 
       var text = d.name+" "+d.last+"<br>";
       if (k == 'r' || k == 'a' ) {
         text += d.aff;
       } else {
         text += d.job
       }
     return text;});

  }
});
}
