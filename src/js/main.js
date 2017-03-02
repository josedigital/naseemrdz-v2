
(function() {


//- jquery-style selectors
window.$ = function (selector) {
  return document.querySelector(selector)
}
//- multiple selectors
window.$$ = function (tagElement) {
  return document.querySelectorAll(tagElement)
}


//- cache DOM
var home = $('.Home')
var target = $('.Work')
var work = $('.Work')
var nav = $('.Navigation')
var secondNav = $('.Navigation__secondary')
var secondNavLinks = $$('.Navigation__secondary a')
secondNavLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    window.scrollTo(0,0)
  })
})
// if(secondNavLink) {
//   secondNavLink.addEventListener('click', function () {
//     window.scrollTo(0,0)
//   })
// }


function hasClass(el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
}

function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
}

//- load function, jquery-style load() method
function load (fileName, domNode) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/'+fileName+'.html');
  xhr.onload = function() {
    if (xhr.status === 200) {
      domNode.innerHTML=xhr.responseText
      var i = $('.Portfolio__image')
      if (i)
        i.addEventListener('click', function () {
          hasClass(i, 'scaleImage') ? removeClass(i, 'scaleImage') : addClass(i, 'scaleImage')
        })
      Satnav.resolve();
    }
    else {
        console.log('Request failed.  Returned status of ' + xhr.status)
    }
  }
  xhr.send()
}



	window.onload = function() {

		Satnav({
			html5: true,
			matchAll: true,
      force: true
		})
    .navigate({
      path : '/?{page}/?{project}',               
      directions : function(params) {
        removeClass(nav, 'is-home')
        addClass(secondNav, 'moveInUp')
        addClass(home, 'moveToLeft')
        addClass(work, 'moveToLeft')
      }
    })
    .change(function(hash) {
        if (hash === '') {
          addClass(nav, 'is-home')
          if (hasClass(home, 'moveToLeft')) {
            removeClass(home, 'moveToLeft')
            addClass(home, 'moveFromLeft')
            addClass(work, 'moveFromLeft')
            removeClass(work, 'moveToLeft')
            removeClass(secondNav, 'moveInUp')
            setTimeout(function () {
              target.innerHTML = ''
            }, 500)
          }
        } else {
          if (hash.startsWith('work/')) {
            // loader goes here
          }
          //   Satnav.resolve(); <-- set at load() function
          removeClass(home, 'moveFromLeft')
          removeClass(work, 'moveFromLeft')
          load(hash, target)
        }

      
      return this.defer;


      // if (hash === '') {
      //   addClass(nav, 'is-home')

      //   if (hasClass(home, 'moveToLeft')) {
      //     removeClass(home, 'moveToLeft')
      //     addClass(home, 'moveFromLeft')
          
      //     addClass(work, 'moveFromLeft')
      //     removeClass(work, 'moveToLeft')

      //     removeClass(secondNav, 'moveInUp')
          
      //     setTimeout(function () {
      //       target.innerHTML = ''
      //     }, 500)

      //   }
        
      // } else {
      //   removeClass(nav, 'is-home')
      //   addClass(secondNav, 'moveInUp')
      //   removeClass(home, 'moveFromLeft')
      //   addClass(home, 'moveToLeft')
      //   removeClass(work, 'moveFromLeft')
      //   addClass(work, 'moveToLeft')
      //   load(hash, target)
      // }
		})
    .otherwise('/')
		.go();
	};

})();
