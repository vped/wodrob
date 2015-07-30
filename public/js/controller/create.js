/**
 * Created by ved on 5/3/15.
 */
var app =angular.module('createApp', []);
app.controller('createController',['$scope', function($scope) {
    'use strict';

    var ft, mainSvg;

    var undoArray = [], redoArray = [];
    $scope.elements = [];
    $scope.currentImage = null;
    $scope.opacity = 1;

    var paper = Raphael("editor", 790, 500);

    //Image array
    $scope.imageArray = [
        {'src': 'WodRob.png'},
        {'src': 'top.jpg'}
    ];

    // click event handler on canvas
    $('#editor').click(function () {
        if ($scope.currentImage !== null) {
            $scope.currentImage.freeTransform.hideHandles();
        }
        $scope.$apply(function () {
            $scope.currentImage = null;
        });
    });

    //Getting the cursor position
    $scope.coOrdinate = function (x, y) {
        $scope.xc = x;
        $scope.yc = y;
    };

    //Captures Image transformation
    $scope.captureEvent = function () {
        var paperJSON = paper.toJSON(function (el, data) {

            if (el.node.localName === "image") {
                return data;
            }
        });
        undoArray.push(paperJSON);
    };

    //getting current image id.
    $scope.getId = function (ev) {
        $scope.imageId = ev;
    };

    //function to drag and drop elements
    var moves = function() {
        mainSvg = document.getElementsByTagName("svg")[0];
        mainSvg.addEventListener("dragenter", function (e)
        {e.preventDefault(); }, false);

        mainSvg.addEventListener("dragover", function (e)
        {e.preventDefault();},false);

        mainSvg.addEventListener("drop",dropped,false);
    };

    // image opacity
    $scope.clickHandler = function(el){
        $scope.$apply(function () {
            $scope.opacity = el.attr().opacity;
        });
        $scope.boxReframe(el);
    };


    //New canvas
    $scope.newCanvas = function () {
        if(confirm("Unsaved changes in the editor,Do you want to continue"))
        {
            paper.clear();
            undoArray =[];
            redoArray =[];
            $scope.elements =[];
            $scope.currentImage=null;
        }
        else
        {
            //do nothing
        }
    };

    //image dropped event
    function dropped (e) {
        console.log('droped');
        var img = $scope.imageId;
        var xpos= e.clientX - $scope.xc;
        var ypos = e.clientY - $scope.yc;
        var image = paper.image(img.src, xpos, ypos,img.width,img.height).click(function () {
            $scope.currentImage = this;
            $scope.clickHandler(this);
        });

        image.attr({
            cursor:'move',
            opacity: 1
        });

        $scope.currentImage=image;
        $scope.opacity = 1;


        $scope.$apply(function () {
            $scope.currentImage.attr().opacity= 1;
        });

        $scope.boxReframe(image);
        $scope.elements.push(image);
        console.log('image',image);
        $scope.captureEvent();
    }


    $scope.boxReframe = function(el) {

        // callback function
        var cb = function(obj,e) {
            var event = e.toString().split(",");

            event.forEach(function(e){
                if (e.toString() === 'rotate end') {
                    console.log('rotate');
                    console.log('$scope image',$scope.currentImage);
                    console.log('$scope',el);
                    $scope.captureEvent();
                }
                else if (e.toString() === 'scale end') {
                    console.log('scale');
                    $scope.captureEvent();

                }
                else if (e.toString() === 'drag end') {
                    console.log('drag');
                    console.log('$scope image',$scope.currentImage);
                    console.log('$scope',el);
                    $scope.captureEvent();
                }
            });
        };

        ft = paper.freeTransform(el,{draw:['bbox'],drag:[ 'self' ],boundary: { x: 50, y: 50, width: 650, height: 400 },
            rotate: true,keepRatio:[ 'axisX', 'axisY', 'bboxCorners', 'bboxSides'],range: { rotate: [ -180, 180 ], scale: [50, 400 ] },
            scale:[ 'axisX', 'axisY', 'bboxCorners', 'bboxSides' ]},cb);

        paper.forEach(function(elements) {
            if(elements.freeTransform !=null && elements.freeTransform.handles.bbox != null)
                elements.freeTransform.hideHandles();
            event.stopPropagation();
        });
        el.freeTransform.showHandles();
    };


    //Function for moving back.
    $scope.back = function () {
        if($scope.currentImage !==null) {
            if($scope.currentImage.prev!=undefined) {
                var bot =  $scope.currentImage.prev;
                $scope.currentImage.insertBefore(bot);
                ft.apply();
                $scope.captureEvent();
            }
        }
    };

    //Function for moving front
    $scope.front = function () {
        if($scope.currentImage !==null) {
            if($scope.currentImage.next!=undefined) {
                var top =  $scope.currentImage.next;
                if($scope.currentImage.next.node.localName == "image")
                    $scope.currentImage.insertAfter(top);
                ft.apply();
                $scope.captureEvent();
            }
        }
    };

    // Function to remove all elements from paper
    //$scope.clear = function () {
    //    paper.clear();
    //    $scope.currentImage = null;
    //    $scope.captureEvent();
    //};

    //Function to rotate element 180 d.
    $scope.flipImage = function () {
        if($scope.currentImage !==null){
            var ft = paper.freeTransform($scope.currentImage);
            ft.attrs.rotate = ft.attrs.rotate + 180;
            if(ft.attrs.rotate === 360){
                ft.attrs.rotate=0;
            }
            ft.apply();
            $scope.captureEvent();
        }
    };

    //Function to rotate element in 90d. cycle.
    $scope.flopImage = function () {

        if ($scope.currentImage !== null) {

            var ft = paper.freeTransform($scope.currentImage);

            ft.attrs.rotate = ft.attrs.rotate + 90;
            if(ft.attrs.rotate === 360) {
                ft.attrs.rotate = 0;
            }
            ft.apply();
            $scope.captureEvent();
        }
    };

    //Function for removing individual elements.
    $scope.deleteImage= function () {
        if($scope.currentImage !==null) {
            var i = _.indexOf($scope.elements,$scope.currentImage);
            $scope.elements.splice(i,1);
            $scope.currentImage.freeTransform.hideHandles();
            $scope.currentImage.hide();
            $scope.currentImage =null;
            $scope.captureEvent();
        }
    };

    //Undo operation
    $scope.undoOperation = function () {

        if($scope.currentImage != null) {
            $scope.currentImage.freeTransform.hideHandles();
            $scope.currentImage = null;
        }


        if($scope.elements.length>0) {

            var undoElement = undoArray.pop();
            redoArray.push(undoElement);

            var applyUndo = _.last(undoArray);
            paper.clear();
            $scope.elements = [];
            paper.fromJSON(applyUndo,function(el, data) {

                // callback function
                var cb = function(obj,e) {

                    //console.log(e);
                    var event = e.toString().split(",");

                    event.forEach(function(e){
                        if (e.toString() === 'rotate end') {
                            console.log('rotate');
                            $scope.captureEvent();
                        }
                        else if (e.toString() === 'scale end') {
                            console.log('scale');
                            $scope.captureEvent();
                        }
                        else if (e.toString() === 'drag end') {
                            console.log('drag');
                            $scope.captureEvent();

                        }
                    });
                };

                ft =  paper.freeTransform(el,{draw:['bbox'],
                    rotate: true,keepRatio:[ 'axisX', 'axisY', 'bboxCorners', 'bboxSides'],
                    scale:[ 'axisX', 'axisY', 'bboxCorners', 'bboxSides' ]},cb);

                var bbox = el.getBBox();
                el.freeTransform.attrs.translate.x =bbox.x;
                el.freeTransform.attrs.translate.y =bbox.y;

                //ft.apply();

                el.click(function () {
                    paper.forEach(function(el) {
                        if(el.freeTransform.handles.bbox != null) {
                            el.freeTransform.hideHandles();
                        }
                    });

                    $scope.$apply(function () {
                        $scope.currentImage=this;
                    });
                    $scope.currentImage=this;
                    $scope.currentImage.freeTransform.showHandles();
                    $scope.currentImage.freeTransform.apply();
                    event.stopPropagation();
                });

                if(el.node.localName == "image"){
                    $scope.elements.push(el.node);
                    return el;
                }
            });

            paper.forEach(function(el) {
                if(el.freeTransform.handles.bbox != null) {
                    el.freeTransform.hideHandles();
                }
            });
        }

    };


    //Redo operation
    $scope.redoOperation = function () {
        if(redoArray.length>0) {
            var redoElement = redoArray.pop();
            paper.clear();
            paper.fromJSON(redoElement,function(el, data) {

                // callback function
                var cb = function(obj,e) {
                    var event = e.toString().split(",");

                    event.forEach(function(e){
                        if (e.toString() === 'rotate end') {
                            console.log('rotate');
                            $scope.captureEvent();
                        }
                        else if (e.toString() === 'scale end') {
                            console.log('scale');
                            $scope.captureEvent();
                        }
                        else if (e.toString() === 'drag end') {
                            console.log('drag');
                            $scope.captureEvent();
                        }
                    });
                };

                //
                paper.freeTransform(el,{draw:['bbox'],
                    rotate: true,keepRatio:[ 'axisX', 'axisY', 'bboxCorners', 'bboxSides'],
                    scale:[ 'axisX', 'axisY', 'bboxCorners', 'bboxSides' ]},cb);

                var bbox = el.getBBox();
                el.freeTransform.attrs.translate.x =bbox.x;
                el.freeTransform.attrs.translate.y =bbox.y;

                el.click(function () {
                    paper.forEach(function(el) {
                        if(el.freeTransform.handles.bbox != null) {
                            el.freeTransform.hideHandles();
                        }
                    });

                    $scope.$apply(function () {
                        $scope.currentImage=this;
                    });
                    $scope.currentImage=this;
                    $scope.currentImage.freeTransform.showHandles();
                    $scope.currentImage.freeTransform.apply();
                    event.stopPropagation();
                });

                if(el.node.localName == "image"){
                    $scope.elements.push(el.node);
                    return el;
                }
            });

            paper.forEach(function(el) {
                if(el.freeTransform.handles.bbox != null) {
                    el.freeTransform.hideHandles();
                }
            });

            $scope.captureEvent();
        }

    };

    //function for cloning element
    $scope.cloneImage = function () {

        if($scope.currentImage !==null) {
            var cloned = $scope.currentImage.clone().click(function () {
                $scope.$apply(function () {
                    $scope.currentImage= this;
                });

                $scope.currentImage= this;
                $scope.boxReframe(cloned);
                console.log('$scope.currentImage',$scope.currentImage)
            });
            cloned.attr("x",$scope.currentImage.attr("x")+15);
            cloned.attr("y",$scope.currentImage.attr("y")+15);

            $scope.currentImage.freeTransform.hideHandles();
            $scope.currentImage = cloned;
            $scope.elements.push(cloned);
            $scope.boxReframe(cloned);
            ft.apply();
            $scope.captureEvent();
        }
    };

    //Function to open the crop Model
    $scope.cropPop = function () {
        if($scope.currentImage !==null) {
            modalProvider.cropPopup($scope.currentImage.attrs);
        }
    };

    //Function To change the opacity
    $scope.setOpacity= function () {
        if($scope.currentImage != null){
            $scope.currentImage.attr({
                opacity:$scope.opacity
            })
        }
    };


    //ZoomIn function
    $scope.zoomIn = function () {
        if ($scope.currentImage!= null) {
            var ft = paper.freeTransform($scope.currentImage);
            if(ft.attrs.scale.y<4) {
                $scope.currentImage.toFront();
                ft.attrs.scale.y = ft.attrs.scale.y  *(1.1);
                ft.attrs.scale.x = ft.attrs.scale.x  *(1.1);
                ft.apply();
                ft.updateHandles();
                $scope.captureEvent();
            }

        }
    };

    //zoomOut function
    $scope.zoomOut = function () {
        if ($scope.currentImage!= null) {
            if(ft.attrs.scale.y>0.5) {
                $scope.currentImage.toFront();
                ft.attrs.scale.y = ft.attrs.scale.y /(1.1);
                ft.attrs.scale.x = ft.attrs.scale.x /(1.1);
                ft.apply();
                ft.updateHandles();
                $scope.captureEvent();
            }

        }

    };
    moves();

    //window.addEventListener("load",moves,false);
}]);
app.directive('forImage', function () {
    return {
        restrict:'CA',
        link: function (scope,elem,attr) {
            elem.on('mousedown', function (e) {
                console.log('me');
                var src = this;
                var  xc= e.offsetX,
                    yc= e.offsetY;
                scope.getId(src);
                scope.coOrdinate(xc,yc);
            });
        }
    }
});


