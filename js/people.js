function fullpeople(w)
{
d3.json("data/people.json", function(error, data) {
  if (error) throw error;

  data.sort(function(a,b) {return d3.ascending(a.last,b.last);});
  var h = {};

  h['now'] = data.filter(function f(d) {return d.group == 'researcher'
           || d.group == 'pro'
           || d.group == 'grad'
           || d.group == 'under'
           ;});
  h['alumni'] = data.filter(function f(d) {return d.group == 'alumni';});

  for (var k in h) {
    if (h[k][0].group == 'alumni')
      d = h['alumni']
    else
      d = h['now']

    var div = d3.select('.'+k)
            .selectAll('div')
            .data(d)
            .enter()
              .append('div')
                .attr('class','col-md-3 col-xs-12')
                .append('div')
                  .attr('class','team') 

    div.append('div')
         .attr('class','team_img col-md-3 col-xs-12')
         .append('img')
           .attr('src',function f(d) { return d.picurl; })
           .style('width', (w < 768)? (w - 68) : (w / 5) + 'px')
           .style('height', (w < 768)? (w - 68) : (w / 5) + 'px')
           .style('filter', 'gray')
           .style('-webkit-filter', 'grayscale(1)')
    div.append('div')
         .attr('class','overlay')
         .style('width', (w < 768)? (w - 68) : (w / 5) + 'px')
         .style('height', (w < 768)? (w - 68) : (w / 5) + 'px')
	 .style('left', (w < 768)?  0 : 30 + 'px')
         .append("a")
           .attr("href",function f(d) {
             if (d.www != "") return d.www; 
             if (d.github != "") return "http://www.github.com/"+d.github;
             if (d.twitter != "") return "http://www.twitter.com/"+d.twitter; 
             return '#';
           })
         .html(function f(d) { 
         var text = "<p>"+d.name+" "+d.last+"</p><p>";
         text += d.job
         text += "</p>";
         return text;});

    }
  });
}
