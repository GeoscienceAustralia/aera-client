var chapters = "https://aera-website.firebaseio.com/develop.json";


    function processSection( section, chapter ) {
        var sectionSlug = section.slug || section.id.replace( chapter.slug + "-", '' ).replace( /[\s\W]/g, '-' );
        var $chapterEl = $( '#' + chapter.slug );
        var content = function () {
            if ( section.html ) {
                return $( "<section>" ).attr( 'id', chapter.slug + "-" + sectionSlug ).html( section.html );
            } else {
                return section;
            }
        }

        $chapterEl.append( content );
        $chapterEl.find( 'br' ).remove();
        // $main.append( $chapterEl );
    }
    // prepare page nav
    function addSideNav( chapter ) {
        var headingEl = $( '<h1>' ).html( chapter._title );
        $( '#' + chapter.slug ).append( headingEl );
        if(!window.location.hash) return;
        var navList = $( '<ul>', { class: 'nav nav-pills nav-stacked' } );
        var nav = $( '<nav class="side-bar page-nav affix-top" >' ).append( headingEl, navList );
        nav.affix( {
            offset: {
                top: 90,
                bottom: function () {
                    return ( this.bottom = $( '.footer' ).outerHeight( true ) )
                }
            }
        } );
        $( '#' + chapter.slug ).prepend( nav );
    }
    // processSideNav
    function processNav( i, section, chapter ) {
        var sectionSlug = section.slug || section.id.replace( chapter.slug + "-", '' );
        var pageLink = $( '<a>', { href: "#" + chapter.slug + "-" + sectionSlug.replace( /[\s\W]/g, '-' ) } ).html( section._title || $( section ).find( 'h2' ).text() );
        var navItem = $( '<li role="presentation">' );
        return navItem.append( pageLink );
    }

    //prepare page for print
    function printPrep(){
        console.log('print this page');
        // $('.tab-pane').each(function(i,e){
            // $('#menu li').removeClass('active'); 
            $('.tab-pane').addClass('active');
            // console.log($(this).find('ul'));
            $('.tab-pane').children('nav').hide();
        // });
        // $('ul>.nav.nav-stacked').hide();

    }

    // divide html into sections broken by h2
    function h2Sections( chapter ) {
        var domHtml = $( '<article>' ).html( chapter.html );
        // look for h2 tags and break into sections
        domHtml.children( 'h2' ).each( function ( index, header ) {
            var $section = $( '<section>' ).attr( 'id', chapter.slug + '-' + header.textContent.toLowerCase().replace( /[\s\W]/g, '-' ) );
            $section.append( $( header ).nextUntil( 'h2:not(:last)' ).addBack() );
            domHtml.append( $section );
        } );
        return domHtml;
    }

    // process images
    function processImages( chapter ) {
        //format images into gallery previews
        var $figs = $( '#' + chapter.slug ).find( 'img:not(.minister-image)' ).unwrap();
        $figs.each( function ( index, img ) {
            prepFigures( index, img, chapter )
        } );
    }
    //process tables
    function processTables( chapter ) {
        //format tables using header and footer rows
        var $tableHeaders = $( '#' + chapter.slug ).find( 'tr:first-child> td' ).each( function ( index, header ) {
            tableHeaders( index, header, chapter );
        } );
    }
    // date modified
    function dateUpdated() {
        var sectionModifiedDate = new Date( section.updated );
        return ( sectionModifiedDate > chapterModifiedDate ) ? chapterModifiedDate = sectionModifiedDate : false;
    }
    // external link icon
    function linkIcons() {

        // first unwrap all links from the surrounding '<u>' tag
        $( 'a' ).unwrap( 'u' );
        // add icon to external links
        $( 'a[href^="http"],a[href^="www"]' ).not( 'a[href*="ga.gov.au"],a[href*="drive.google.com"]' ).addClass( "external" );
        // add icon class to google drive assets
        $( 'a[href*="drive.google.com"]' ).addClass( 'asset-excel' ); 
    }
    /** smoothscroll to content anchor points */
    function anchorScroll( this_obj, that_obj, base_speed ) {
        var nav_offset = ( $( 'nav.navbar-default' ).position().top > 0 ) ? 140 : 85;
        var this_offset = this_obj.offset().top;
        var that_offset = that_obj.offset().top - nav_offset;
        $( "html,body" ).scrollTop( that_offset );
    };

    function tableHeaders( index, header, chapter ) {
        //replace links to Tables 
        var label = "Table " + ( index + 1 );
        var $chapterEl = $( '#' + chapter.slug );

        //  prepend table number to heading
        var tblHeadingEl = $( header ).children( ":first" );
        var tblHeadingTxt = tblHeadingEl.text().replace( /\s*Table\s+\d+\s*/, '' );
        tblHeadingEl.replaceWith( '<span class="table-caption"><span class="table-num">' + label + '. </span>' + tblHeadingTxt + '</span>' );

        // add id to table and enable focus
        $( header ).parent().closest( 'table' ).attr( {
            'id': function ( i ) {
                return chapter.slug + '-table-' + ( index + 1 );
            },
            'tabindex': 1
        } );

        // find corresponding link to bookmark id
        if ( header.id ) {
            var linkQuery = 'a[href="#' + header.id + '"]';
            var $links = $chapterEl.find( linkQuery ).not( "[href='#']" );

            $links.each( function ( i, link ) {
                $( link ).text( label ).click( function ( e ) {
                    e.preventDefault();
                    $( 'html, body' ).animate( {
                        scrollTop: $( '[id="' + header.id + '"]' ).parent().closest( 'table' ).focus().offset().top - 200
                    }, 200 );
                } );
            } );
        }
    };

    function prepFigures( index, img, chapter ) {
        //look for caption 
        var caption = img.title || "";
        var linkLabel = "Figure " + ( index + 1 );
        var $chapterEl = $( '#' + chapter.slug );
        var fancyboxDataType;
        // var bookmarkId;
        var figureRef = chapter.slug + '-fig-' + ( index + 1 );
        // is there an empty para after?
        if ( $( img ).next( 'p' ).is( ':empty' ) ) $( img ).next( 'p' ).remove();

        // find corresponding link to bookmark id
        if ( img.id ) {
            var bookmarkId = img.id || "";
            var linkQuery = 'a[href="#' + bookmarkId + '"]';
            var $links = $chapterEl.find( linkQuery ).not( "[href='#']" );

            $links.each( function ( i, link ) {
                //  focus img tag
                $( link ).text( linkLabel )
                    .click( function ( e ) {
                        e.preventDefault();
                        var img = $( 'img[id="' + bookmarkId + '"]' );
                        $( 'html, body' ).animate( {
                            scrollTop: img.attr( 'tabindex', -1 ).focus().offset().top - 100
                        }, 200 );
                    } );
            } );
        }

        // for gallery - wrap image with anchor tag and caption 
        // does image have a filename descriptor in the 'alt' tag?
        var getImgUrl = function () {
            // is a Url or filename set in the src?
            if ( img.src.match( /\.(jpg|jpeg|png|gif|svg)$/ ) ) {
                fancyboxDataType = "image";
                return getImgParams( img );
            }
            // what about the alt attr?                 
            else if ( img.alt.match( /\.(jpg|jpeg|png|gif|svg)$/ ) ) {
                return img.alt.match( /AERA[^/]+\.(jpg|jpeg|png|gif|svg)$/ ); //.replace( /(AERA_)(\d_)/, "$10$2" );
                // todo: don't assume image is in the 'Cloudinary' repo:

            } else {
                console.error( "missing image: ", img );
            }
        };

        var $figCaption = $( '<div class="fig-caption"><span>Figure ' + ( index + 1 ) + '. ' + caption + '</span></div>' );
        var $fancyWrapEl = $( '<a data-src="' + getImgUrl() + '" data-caption="' + caption + '" data-fancybox="' + chapter.slug + '-figures" data-type="' + fancyboxDataType + '"></a>' );
        
        var sectionEl = $( img ).parents( 'section' )[ 0 ];

        // check if summary img, then add class to float img;
        if ( index === 0 && $( img ).parents( 'section' )[ 0 ] && $( img ).parents( 'section' )[ 0 ].id.endsWith( 'summary' ) ) {
            $( $fancyWrapEl ).attr( { 'class': 'summary-img' } );
            $chapterEl.find( 'h2' ).first().after( $( img ) );
        }
        var $pictureEl = $('<picture>');
        var $printEl = $('<source>').attr({'srcset':getImgParams( img ), 'media' : 'print and (min-resolution: 300dpi)'});
        var $sourceEl = $('<source>').attr({'srcset':img.src, 'media' : 'screen'});
        var $figureLink = $( img ).wrap($fancyWrapEl).wrap( $pictureEl );
        $( img ).parent('picture').after($figCaption);
        $( img ).before($sourceEl,  $printEl);
        $( img ).remove();
        // $( img ).replaceWith('<source>');


    };

    function getImgParams( img ) {
        if ( isCloudinary( img ) ) {
            // does it contain the size directive?
            if ( img.src.match( 'w_200' ) ) {
                return img.src.replace( 'w_200', 'w_1000' );
            } else {
                var pathUrl = img.src.split( 'upload' );
                return pathUrl[ 0 ] + 'upload/c_scale,f_auto,w_1000' + pathUrl[ 1 ];
            }
        } else { // file hosted locally
            return '../assets/images/' + img.src.split( 'http://' )[ 1 ];;
        }

    }

    function isCloudinary( img ) {
        if ( img.src.match( 'cloudinary' ) ) {
            return true;
        } else {
            return false;
        }
    }

    $( document )
    .ready( function () {
        /**  implement navigo page routing for persistent hash-bang url's */
        var root = null;
        var useHash = true;
        var hash = '#!';
        var router = new Navigo( root, useHash, hash );

        router.on( {
                '/': function ( params, query ) {
                    window.scrollTo( 0, 0 );
                    $( 'body' ).one( 'mousemove', function () {
                        $( 'html, body' ).animate( {
                            scrollTop: 400
                        }, 2000 );
                    } );
                },
                '/home': function ( params, query ) {
                    goTo();
                    $( 'html, body' ).animate( {
                        scrollTop: $( "#menu-bar" ).offset().top - 400
                    }, 200 );
                },
                '/executive-summary': function ( params, query ) {
                    goTo();
                },
                '/energy-resources-and-market': function ( params, query ) {
                    goTo();
                },
                '/oil': function ( params, query ) {
                    goTo();
                },
                '/gas': function () {
                    goTo();
                },
                '/coal': function () {
                    goTo();
                },
                '/uranium-and-thorium': function () {
                    goTo();
                },
                '/geothermal': function () {
                    goTo();
                },
                '/hydro': function () {
                    goTo();
                },
                '/solar': function () {
                    goTo();
                },
                '/wind': function () {
                    goTo();
                },
                '/ocean': function () {
                    goTo();
                },
                '/bio': function () {
                    goTo();
                },
                '/appendices': function () {},
                '/glossary': function () {
                    goTo();
                },
                '/resource-classification': function () {
                    goTo();
                },
                '/measurements': function () {
                    goTo();
                },
                '/acronyms': function () {
                    goTo();
                },
                '/feedback': function () {
                    goTo();
                },
                '/print': function () {
                  printPrep();
                }

            } )
            .resolve();

        router.notFound( function () {
            router.navigate( path = '/home' )
        } );

        /** replace main content based on 'page' name url */
        function goTo() {
            //update page url
            var pageName = window.location.hash.substring( 3 );
            router.navigate( ( pageName.length > 0 ) ? path = '/' + pageName : path = '/home' );

            /** using bootstrap nav tabs for show/hide content tab panels */
            var $tabLink = $( 'a[href="#' + pageName + '"]' );
            $tabLink.tab( 'show' );

            /** fix navbar during page scrolling (except for home page) */
            if ( pageName == 'home' ) {
                $( window ).off( '.affix' );
                $( "#menu-bar" )
                    .removeClass( "affix affix-top affix-bottom" )
                    .removeData( "bs.affix" );
                $( ".side-bar" )
                    .removeClass( "affix affix-top affix-bottom" )
                    .removeData( "bs.affix" );
                    
                // $( 'html, body' ).animate( { scrollTop: $(document ).height() },200);
            } else {
                $( ".side-bar" )
                    .removeClass( "affix affix-bottom" )
                    .removeData( "bs.affix" );
                $( '#' + pageName + ' .page-nav' ).affix( { offset: { top: 90 } } );
                $( '#menu-bar' ).affix( { offset: { top: 90 } } );
                window.scrollTo( 0, 0 );

            }
            // update menu links to show current position          
            var parEl = $tabLink.parents( '.dropdown' ).find( '.dropdown-toggle' );
            $( '.menu-item' ).text( '' ).prev().removeClass( 'caret-right' );
            parEl.find( 'span:nth-child(2)' ).addClass( 'caret-right' );
            parEl.find( 'span:last-child' ).text( $tabLink[ 0 ].text );

            // get header style from hidden div in page section
            $( 'header.banner' ).attr( 'class', 'banner ' + pageName + '-banner' );

            //ensure hamburger menu works for mobile
            if ( $( '.navbar-toggle' ).css( 'display' ) != 'none' ) {
                $( ".navbar-toggle" ).trigger( "click" );
            }
        };

        $( '#menu a[class!=dropdown-toggle]' ).click( function ( e ) {
            e.preventDefault();
            window.location.hash = '#!/' + this.href.split( '#' )[ 1 ];
        } );

        $( 'a[data-toggle="tab"]' ).on( 'shown.bs.tab', function ( e ) {
            ( $( '.modal.in' ) ) ? $( '.modal.in' ).modal( 'hide' ): false;
        } );

        if ( !String.prototype.endsWith ) {
            String.prototype.endsWith = function ( searchString, position ) {
                var subjectString = this.toString();
                if ( typeof position !== 'number' || !isFinite( position ) ||
                    Math.floor( position ) !== position || position > subjectString.length ) {
                    position = subjectString.length;
                }
                position -= searchString.length;
                var lastIndex = subjectString.indexOf( searchString, position );
                return lastIndex !== -1 && lastIndex === position;
            };
        }

    } );
    

$.ajax( {
    dataType: "json",
    url: chapters,
    data: {}
} )
.done( function ( data ) {

    var $main = $( 'main#content.tab-content' );

    // process each chapter
    $.each( data, function ( i, chapter ) {
        var chapterModifiedDate = new Date( chapter.updated || 0 );
        var $chapterEl = $( '#' + chapter.slug );

        //  is the chapter already broken into sections?
        if ( chapter.sections.length > 0) {
            addSideNav( chapter );
            // process each section
            chapter.sections.forEach( function ( section, i ) {
                processSection( section, chapter );
                //append nav item

                $( '#' + chapter.slug + ' ul.nav-stacked' ).append( processNav( i, section, chapter ) );
            } );

        }
        //  or do we need to divide the chapter using the h2 tags?
        else if ( chapter.html.length > 0 && chapter.slug != 'home' ) {
            var sectionsHtml = h2Sections( chapter );

            if ( sectionsHtml.children( 'section' ).length > 0 ) {
                addSideNav( chapter );
                sectionsHtml.children( 'section' ).each( function ( i, section ) {
                    processSection( section, chapter );
                    //append nav item
                    $( '#' + chapter.slug + ' ul.nav-stacked' ).append( processNav( i, section, chapter ) );
                } );
            } else {
                //remove h1
                // var content = chapter.html.replace( /\<h1.+\<\/h1>/, '' );
                var section = $( '<section/>' ).addClass( 'single-section' ).append( chapter.html );
                $chapterEl.append( section );
            }
        }

        // todo: tables formatting
        processTables( chapter );
        processImages( chapter );
        linkIcons();

        $chapterEl.removeClass( 'loading' );
        $chapterEl.append( $( '<small>' ).attr( 'class', 'date' ).html( 'Updated: ' + chapterModifiedDate.toDateString() ) );

    } );

   
    /**  use bootstrap scrollspy to map page position to page anchor links */
    $( 'body' ).scrollspy( {
        target: "article nav.side-bar",
        offset: ( $( 'nav.navbar-default' ).position().top > 0 ) ? 145 : 85
    } ).on( 'activate.bs.scrollspy', function ( e ) {

        var el = $( e.target ).parent( 'ul' );

        if ( el[ 0 ] && el[ 0 ].clientHeight < el[ 0 ].scrollHeight ) {
            var offset = $( e.target ).offset().top - $( e.target ).parent( 'ul' ).offset().top;
            $( e.target ).parent( 'ul' ).scrollTop( offset );
        };
    } );

    // over-ride click event for inline links to avoid appending link hash to url 
    $( '.side-bar a' ).not( '[href="#"]' ).not( '[data-fancybox]' ).click( function ( e ) {
        e.preventDefault();
        var $target = document.getElementById( this.hash.substring( 1 ) );
        anchorScroll( $( this ), $( $target ), 100 );
    } );

    $().fancybox( {
        selector: '[data-fancybox]',
        width: "auto",
        // fitToView: true,
        aspectRatio: true,
        animationEffect: 'fade',
        toolbar : true,
        infobar: true,
        idleTime: false,
        type: 'inline',
        // smallBtn: 'true',
        padding: [ 0, 0, 0, 0 ],
        clickContent: false,
        protect:false,
        iframe : { 
            preload: true},
        spinnerTpl: '<div class="fancybox-loading"></div>',
        thumbs: {
            autoStart: true, // Display thumbnails on opening
            hideOnClose: false // Hide thumbnail grid when closing animation starts
        },
        btnTpl: {
            download: 
            '  <button data-fancybox-download class="fancybox-button fancybox-button--download dropdown-toggle" title="Download" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
            +'    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px">'
            +'      <style type="text/css">	.st0{fill:none;stroke:#FFFFFF;}</style>'
            +'      <path class="st0" d="M27.9,15.8h3.4v7.1V30h-9.7h-9.7v-7.1v-7.1h3.7"/>'
            +'      <polyline class="st0" points="25.8,20.4 21.6,24.7 17.4,20.4 "/>'
            +'      <line class="st0" x1="21.6" y1="24.4" x2="21.6" y2="12.4"/>'
            +'    </svg>'
            +'  </button>'
            +'  <ul class="dropdown-menu download-menu" aria-labelledby="dropdownMenu1">'
            +'    <li><a href="/assets/download/filename" download target="_blank">Download image</a></li>'
            +'    <li><a href="/assets/download/chapterName.zip" download target="_blank">Chapter images</a></li>'
            +'    <li><a href="/assets/download/AERA_all.zip" download target="_blank">All AERA images [166MB]</a></li>'
            +'  </ul>'
        },        
        buttons: [
            // "zoom",
            "download",
            "slideShow",
            "fullScreen",
            "thumbs",
            "close"
        ],
        afterClose: function () {
            $( 'a>img' ).show();
        },
        afterLoad : function(instance, current) {                
                current.width = window.innerWidth - 100 ;
                current.height = window.innerHeight ;
        },
        afterShow : function(instance, current){
            // imageFilename = this.src.match(/AERA_.+?\./) + 'jpeg';
            // var getChapterImages = this.src.match(/AERA_\d+/)+".zip";

            $('.fancybox-button--download').on('click', function() {
                event.preventDefault();

                function toSentenceCase(str) {
                    return str.replace(/(^|\s)[a-z]/, function(match) {
                        return match.toUpperCase();
                    });
                }

                var filename = current.src.match(/AERA_\d+[-_]\d+/)[0].replace(/_(\d)([-_])/,function(match, P1, P2){ return '_0'+P1+'-'; });
                var chapterNum = filename.match(/AERA_(\d+)/)[1];
                var chapterName = toSentenceCase( window.location.hash.substring( 3 ));
                
                var menuItem = [
                    {'fname' : filename + '.jpg'}, 
                    {'chapterName' : 'AERA_'+ chapterNum +'-'+ chapterName+'.zip'},
                    {'all' : 'AERA_all.zip'}
                ];

                $(this).next('ul').find('a').each(function(i,e){
                    if(i==0) {
                        $(e).attr('href', current.src.replace('svg', 'jpeg'));
                    } else{
                        $(e).attr('href','/assets/download/' + Object.keys(menuItem[i]).map(function(itm) { return menuItem[i][itm]; }));
                    }
                });
                
            });
        }

    } );
    $.fancybox.defaults.hash = false;


    // if page is appended to url, open tab from url location
    if ( window.location.hash && window.location.hash.substring( 5 ) ) {
        var $articleEl = $( '#' + window.location.hash.substring( 3 ) );
        $articleEl.tab( 'show' );
    }
    // cl.responsive();

    

} );