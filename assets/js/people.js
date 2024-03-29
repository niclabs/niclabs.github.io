function fullpeople(w)
{
d3.json("assets/data/people.json", function(error, data) {
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
                .attr('class','col-lg-3 col-md-6 col-12 wow fadeInUp')
	        .attr('data-wow-delay','.3s')
	        .attr('style','visibility: visible; animation-delay: 0.3s; animation-name: fadeInUp;')
                .append('div')
                  .attr('class','single-team') 

    div.append('div')
         .attr('class','team-image')
         .append('img')
           .attr('src',function f(d) { return d.picurl; })
           .style('filter', 'gray')
           .style('-webkit-filter', 'grayscale(1)')
    div.append('div')
         .attr('class','content')
	 .style('left', (w < 768)?  0 : 30 + 'px')
         .append("a")
           .attr("href",function f(d) {
             if (d.www != "") return d.www; 
             if (d.github != "") return "http://www.github.com/"+d.github;
             if (d.twitter != "") return "http://www.twitter.com/"+d.twitter; 
             return '#';
           })
         .html(function f(d) { 
         var text = "<h4>"+d.name+" "+d.last+"<span>";
         text += d.job
         text += "</span></h4>";
         return text;});

    }
  });
}
