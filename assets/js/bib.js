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
   .attr('class','widget search-widget');
  
tooltip= sidebar.append('div')
    .attr('id','tooltip')
  
span=tooltip.append('span')
    .attr('id','tooltiptext')  
    .html('Limpiar filtros') 

span2=tooltip.append('span')
    .append('img')
    .attr('src', 'assets/images/filter-icon.svg')
    .attr('class', 'filter-icon');

sidebar.append('h5')
    .attr('class','widget-title')
    .html('Filtros')
  
  //Category  filter-label
sidebar.append('div')
    .attr('class','dropdown')
    .append('h6')
    .attr('class', 'widget-subtitle')
    .attr('id','category-label')
    .html('Categoria')
    .append('img')
    .attr('src','assets/images/arrow.svg')
    .attr('class','list_arrow')

sbody = sidebar.append('div')
   .attr('class','sidebar__section')
   .append('div')
   .attr('class','sidebar__body') ;

  
//--------------

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

//-----

Object.keys(cswitch).forEach(function(key) {
    fil = sbody.append('div')
	    .attr('class','sidebar__filter')
	    .append('label')

    fil.append('input')
      .attr('id','checkbox')
	    .attr('type','checkbox')
	    .attr('name',key)
	    .on('click',function(){divswitch(key)
        categorias=Object.keys(cswitch).filter(function (key) {
          return cswitch[key] === 1;
        });filter(authors,fates,titles)} )

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

//--------------------------

//Title-filter-label
sidebar.append('h6')
   .attr('class', 'widget-subtitle')
   .attr('id','title-label')
   .html('<br>Título<br><br>');
  
   
   //title-filter-input
sidebar.append('input')
   .attr('type', 'text')  
   .attr('id', 'title-filter-input')
   .attr('placeholder', 'Ingrese el título');

 /* title-input-event: saves a variable called titles.*/
 var title= document.getElementById('title-filter-input')
 var titles;
 title.addEventListener('input',()=>{
      titles=title.value
 })

  //d3 handling
d3.select('#title-filter-input').on('input', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
});
    var searchTerm = this.value;
    filter(authors,fates,searchTerm)
  });
  
  //author-filter-label
sidebar.append('h6')
  .attr('class', 'widget-subtitle')
  .html('<br>Autor<br><br>');

sidebar.append('input')
  .attr('type', 'text')  
  .attr('id', 'author-filter-input')
  .attr('placeholder', 'Ingrese el autor');
 
d3.select('#author-filter-input').on('input', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
});
    var searchTerm = this.value;
    filter(searchTerm,fates,titles)
  });

  //Author event
var author= document.getElementById('author-filter-input')
var authors;
author.addEventListener('input',()=>{
  authors=author.value
}
)    
  //date-filter-label
sidebar.append('h6')
  .attr('class', 'widget-subtitle')
  .html('<br>Fecha<br><br>');

var fates;//variable for saving date input
  
//input for date-filter
sidebar.append('input')
    .attr('type','text')
    .attr('id','airdatepicker')
    .attr('placeholder','Selecciona una fecha')
    .attr('class','form-control')

/* Airdatepicker: Is a modern JavaScript calendar written on ES6 with the use of CSS native variables. 
It weights only ~ 13kb (minified + gzip). It works in every modern browser which has support of CSS native variables. 
It's easy to customize, supports keyboard navigation, has big amount of options and convenient API.
Because of Air Datepicker written in pure JavaScript it can be integrated in any modern framework - whether it's Angular or React.*/

// new calendar instance
new AirDatepicker('#airdatepicker', {
      buttons: ['today', 'clear'],
          range: true,
    multipleDatesSeparator: ' - ',
    isMobile: true,
    autoClose: true,
    onSelect({date, formattedDate, datepicker}){   
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });  
    fates=formattedDate
    filter(authors,fates,titles)
  }})
  
  /* Function made for finding the common elements for an given arrays.*/
function encontrarInterseccionMultiple(...arreglos) {
  if (arreglos.length < 2) {
    return [];
  }
  function encontrarInterseccionDos(arr1, arr2) {
    return arr1.filter(elemento1 =>
      arr2.some(elemento2 =>
        Object.entries(elemento1).every(([clave, valor]) =>
          elemento2.hasOwnProperty(clave) && elemento2[clave] === valor
        )

        )
    );
  }
  const interseccion = arreglos.reduce((resultado, arreglo) => {
    return encontrarInterseccionDos(resultado, arreglo);
  });

  return interseccion;
}

//--------------------------

//filters

function filterByCategory(category){
  var filteredresults;
  if(category == [] || category == undefined || category.length==0){filteredresults=data 
  return filteredresults}
  filteredresults=data.filter(item=>{
    return categorias.includes(item.key)
  })
 return filteredresults
}

function filterByTitle(searchTerm) {
  var filteredresults;
 
  if(titles =='' || titles==undefined ){filteredresults=data}
 
  else{ filteredresults=data.filter(item=>{
  return item.title.toLowerCase().includes(searchTerm.toLowerCase())
})}
 return filteredresults
}

function filterByAuthor(author) {
  var filteredresults;
  if(author == '' || author == undefined){filteredresults=data}
 
  else{
    filteredresults=data.filter(item=>{
      if(Object.keys(item).includes('author')){ return  item.author.includes(author)}
    })   
  }
   
  return filteredresults
}

function filterByDate(date){
  var filteredresults
  if(date==undefined || date==[] || date==''){filteredresults=data
  
  return filteredresults}
  var fechas1;
  var fechas2;
  
  if(date.length==1){
    fechas1=date[0].slice(6,)
    filteredresults=data.filter(function(item){
      if(Object.keys(item).includes('year')){return item.year == parseInt(fechas1)  }
      else{filteredresults=data}
    })
  }
 
  if(date.length==2){
    fechas1=date[0].slice(6,)
    fechas2=date[1].slice(6,)
    filteredresults=data.filter(function(item){
      if(Object.keys(item).includes('year')){return item.year >= parseInt(fechas1) && item.year <= parseInt(fechas2) }
      else{filteredresults=data}
    })
  }
   
   
return filteredresults
}

d3.select('.filter-icon').on('click',function(){
  var checkboxes = document.querySelectorAll('#checkbox');
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
  categorias=[]
  title.value=''
  author.value=''
  fecha= document.getElementById('airdatepicker')
  fecha.value=''
  titles=[]
  authors=[]
  fates=[]
  for (var key in cswitch) {
    cswitch[key] = 0;
} 
window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
 
  filter(authors,fates,titles)
})

content = div.append('div')
.attr('class','col-9')

function filter(author,date,title){
  var filteredResults;  
  var categories=filterByCategory(categorias)
  var autores=filterByAuthor(author)
  var fechas=filterByDate(date)
  var titulos=filterByTitle(title)
  filteredResults=encontrarInterseccionMultiple(categories,autores,fechas,titulos)
  if(filteredResults.length==0 ){
    content.html('')
  content.append('h3')
     .html('No se encontraron resultados')
    }
  else{  updateVisualization(filteredResults) }

}
var isScrolling;
var sidebar = document.querySelector('.sidebar');

window.addEventListener("scroll", function () {
  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(function () {
    var scrollPosition = window.scrollY;
    var footer = document.querySelector('.footer'); 
    if (scrollPosition >= 160 && scrollPosition <footer.offsetTop-sidebar.offsetHeight-50) {
      var translateY = scrollPosition - 160;
  
      requestAnimationFrame(function () {
        sidebar.style.transform = 'translateY(' + translateY + 'px)';
      });
    } 
    else {
    
      requestAnimationFrame(function () {
        sidebar.style.transform = 'translateY(0)';
       
      });
    }
  }, 100); 
});

//visualization


function updateVisualization(filteredResults) {
  content.html('');   
  const filteredatalen=filteredResults.length

for (i = filteredatalen - 1; i >= 0; i--)
 {
 var paper = content.append('div')
      .attr('class','single-blog-grid')
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


 paper.append('div')
   .attr('class','col-1')
   .append('img')
     .attr('class','tag')
     .attr('src',filteredResults[i].icon)

if (filteredResults[i].key === 'projects' || filteredResults[i].key === 'software') {
   paper.append('div')
     .attr('class','col-6')
  .append('div')
    .attr('class','meta-info')
       .append('a')
       .attr('class','date')
       .attr('href',filteredResults[i].link)
       .html('<i class="lni lni-timer"></i>' + ((filteredResults[i].end > 1)?'Inactive: ' + filteredResults[i].begin + '-' + filteredResults[i].end:'Active: ' + filteredResults[i].begin + ' - today'))
} else {
   paper.append('div')
     .attr('class','col-6')
        .append('div')
          .attr('class','meta-info')
             .append('a')
       .attr('class','date')
       .attr('href',filteredResults[i].link)
             .html('<i class="lni lni-pin"></i>' + filteredResults[i].place)
}
       
 paper.append('div')
   .attr('class','col-6')
   .append('div')
     .attr('class','org')
     .html("<strong>Organization: </strong><a href=" + filteredResults[i].orgurl+">" + filteredResults[i].org + "</a><p style='text-align:right;'><strong>Year: </strong>" + filteredResults[i].year + ".</p>")

 txt = paper.append('div')
   .attr('class','col-12')

 txt.append('p')
   .html(filteredResults[i].desc)

 txt.append('p')
   .html(filteredResults[i].author)

// recursos asociados

 if (filteredResults[i].hasOwnProperty('id')) {
   myid = (filteredResults[i].id).split(".");
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
 }

updateVisualization(data)
})}