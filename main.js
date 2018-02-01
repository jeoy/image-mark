$(function () {
    // if ( !$("#path").val() ){
    // 	disabled ="enabled"
    // }
    var record = "";
    var count = 0;
    var start = false;

    var fileName = "";
    var oX, oY;
    var rectangle;
    var listCount;
    var scale;

    var canvasW,
        canvasH,
        startX,
        startY,
        moveX,
        moveY,
        endX,
        endY,
        distanceX,
        distanceY;

    var canvasDate = {};
    var recordIn = '';
    var isResize = false;
    var cat = '';

    var output = '';

    var nameArr,
        resultArr;
    $("#store").val(window.localStorage["data"]);
    $("#store").animate({
        scrollTop: $("#store")[0].scrollHeight - $("#store").height()
    }, 1000);
    // $("#preview").attr("src","img/logoGray.png");

    $("#start").click(function () {
        start = true;
    });

    $("#clear").click(function () {
        $("#mark").val("");
        record = "";
        count = 0;
        $(".point").remove();
        $(".rectangle").remove();
        oGC.clearRect(0, 0, 3000, 2500)
        for (i = 0; i < canvasDate[fileName].length; i++) {
            if (canvasDate[fileName]) {
                canvasDate[fileName] = []
            }
        }

    });
    $("#clearAll").click(function () {
        $("#store").val("");
        window.localStorage["data"] = "";
    });
    $("#submit").click(function () {
        if ($("#mark").val()) {
            if (!(count % 2)) {
                output = ''
                for (var key in canvasDate) {

                    for (i = 0; i < canvasDate[key].length; i++) {
                        if (i == 0) {
                            output += key + ' '
                            output += canvasDate[key].length + ' '

                        }
                        output += canvasDate[key][i][6] + ' '
                        output += (+canvasDate[key][i][0]).toFixed(0) + ' '
                        output += (+canvasDate[key][i][1]).toFixed(0) + ' '
                        output += (+canvasDate[key][i][4]).toFixed(0) + ' '
                        output += (+canvasDate[key][i][5]).toFixed(0) + ' '
                        if (i == canvasDate[key].length - 1) {
                            output += '\n'
                        }
                    }
                }
                $("#store").val(output)
                window.localStorage["data"] = output
                count = 0;
                if ($('#auto').prop('checked')) {
                    start = true;
                } else {
                    start = false;
                }

                var strDataURI = canvasDom[0].toDataURL();

                // saveFile(strDataURI,'download.png')

                $(".point").remove();
                $("#store").animate({
                    scrollTop: $("#store")[0].scrollHeight - $("#store").height()
                }, 1000);
                $("#nextImg").click();

            } else {
                alert("亲，还有一个框没画完呢");
            }
        } else {}

    })

    $("#genFileList").click(function () {
        if ($("#fileListInput").val()) {
            var fileArr = $("#fileListInput").val().split("\n");
            var selectDom = $("<select multiple></select>");

            $("#fileListInput").slideUp(1000);
            for (var i = 0; i < fileArr.length; i++) {
                if (fileArr[i]) {
                    var newOption = $("<option>" + fileArr[i] + "</option>");
                    newOption.appendTo(selectDom);
                    if (!canvasDate[fileArr[i]]) {
                        canvasDate[fileArr[i]] = []
                    }
                    // recordIn[fileArr[i]] = []
                }

            }
            $("#fileList").append(selectDom);
            $("#fileList select").slideDown(1000, function () {

                $("#fileList").trigger("change");
                $("#fileList option:eq(0)").click();
                $("#fileList option:eq(0)")[0].selected = "selected";
                // fileName =  $("#fileList option:eq(0)").val();
                // recordIn = fileName + " " + 0

                // $("#mark").val(recordIn);
                // count = 0;
                // $("#preview").attr("src","data/"+ fileName);
            });
            $(this).slideUp(1000);
            $("#nextImg").attr("disabled", false);
            $("#preImg").attr("disabled", false);
        } else {
            alert("请先将文件列表复制到这里")
        }

    });

    //用于测试

    // var fileArr = $("#fileListInput").val().split("\n");
    // 		var selectDom = $("<select multiple></select>");

    // 		$("#fileListInput").slideUp(1000);
    // 		for (var i = 0; i < fileArr.length; i++) {
    // 			if(fileArr[i]){
    // 				var newOption =  $("<option>"+fileArr[i] +"</option>");
    // 				newOption.appendTo(selectDom);
    // 			}

    // 		}
    // 		$("#fileList").append(selectDom);
    // 		$("#fileList select").slideDown(1000);
    // 		$(this).attr("disabled","disabled");
    // 		$("#nextImg").attr("disabled",false);
    // 		$("#preImg").attr("disabled",false);

    $("#nextImg").click(function () {
        var currOption,
            slecetScrollTop;

        currOption = $("#fileList option:selected");

        if (currOption.val() == $("#fileList option:last").val()) {

        } else {
            currOption.next().click();
            currOption[0].selected = "";
            currOption.next()[0].selected = "selected";
        }
        if (listCount == 8) {
            slecetScrollTop = $("#fileList select").scrollTop() + 40;
            $("#fileList select").animate({
                scrollTop: slecetScrollTop
            }, 200);
        } else {
            listCount++;
        }

        // currOption.val()
    });
    $("#preImg").click(function () {
        var currOption;
        currOption = $("#fileList option:selected");

        if (currOption.val() == $("#fileList option:first").val()) {

        } else {
            currOption.prev().click();
            currOption[0].selected = "";
            currOption.prev()[0].selected = "selected";
        }

        if (listCount == 1) {
            slecetScrollTop = $("#fileList select").scrollTop() - 40;
            $("#fileList select").animate({
                scrollTop: slecetScrollTop
            }, 200);
        } else {
            listCount--;
        }

    });

    var canvasDom = $("#myCanvas");
    var oGC = canvasDom[0].getContext("2d");
    oGC.lineWidth = 3;
    oGC.strokeStyle = 'rgba(14,255,7,1)';

    $("#preview").on('load', function () {
        let oriWidth = getNaturalWidth(this)
        let oriHeight = getNaturalHeight(this)
        let screenWidth = document.body.clientWidth
        let screenHeight = document.body.clientHeight

        let adaptW = screenWidth - 200
        let adaptH = screenHeight - 140
        let tmpH = oriHeight * adaptW / oriWidth
        let tmpW = oriWidth * adaptH / oriHeight
        if (tmpH < adaptH) {
            adaptH = tmpH
            adaptW = adaptW
        } else {
            adaptW = tmpW
            adaptH = adaptH
        }
        scale = adaptW / oriWidth
        console.log('img load')
        this.style = 'width:' + adaptW + 'px; height:' + adaptH + 'px;'
        canvasDom[0].width = adaptW
        canvasDom[0].height = adaptH
        oGC.lineWidth = 3;
        oGC.strokeStyle = 'rgba(14,255,7,1)';
        for (let i = 0; i < canvasDate[fileName].length; i++) {
            canvasDate[fileName][i][7] = scale
        }

        oGC.clearRect(0, 0, 3000, 2500)
        for (let i in canvasDate[fileName]) {
            if (canvasDate[fileName].length) {
                let _startX = canvasDate[fileName][i][0] * canvasDate[fileName][i][7] + 200
                let _startY = canvasDate[fileName][i][1] * canvasDate[fileName][i][7] + 140
                let _endX = _startX + canvasDate[fileName][i][2] * canvasDate[fileName][i][7]
                let _endY = _startY + canvasDate[fileName][i][3] * canvasDate[fileName][i][7]

                var point = $('<img class="point" id="' + (2 * i) + '" src = "img/Mapicon.png">');
                point.css({
                    "left": +_startX - 17,
                    "top": +_startY - 35
                });
                point.appendTo("body");
                point.fadeIn();

                var point = $('<img class="point" id="' + (2 * i + 1) + '" src = "img/Mapicon.png">');
                point.css({
                    "left": +_endX - 17,
                    "top": +_endY - 35
                });
                point.appendTo("body");
                point.fadeIn();
                $(".point").animate({
                    opacity: '0'
                }, 100);
                rect(oGC, canvasDate[fileName][i][0], canvasDate[fileName][i][1], canvasDate[fileName][i][2], canvasDate[fileName][i][3], canvasDate[fileName][i][7]);
            }

        }

        //这里给 canvas 设置宽高会导致图形拉伸
        // [0].style = 'width:' + canvasW + 'px; height:' + canvasH + 'px;'

    })

    function saveFile(data, fileName) {
        var saveLink = document.createElement('a');
        saveLink.href = data;
        saveLink.download = fileName;
        saveLink.click();
    }

    canvasDom.mousemove(function (e) {
        var markX = ((+(e.pageX) - 200) / scale).toFixed(0)
        var markY = ((+(e.pageY) - 140) / scale).toFixed(0)

        // var markX = ((+(e.pageX ) - 200) ).toFixed(0)
        // var markY = ((+(e.pageY ) - 140) ).toFixed(0)
        $('.mousePosition').html("X Position:" + markX + "<br>   Y Position:" + markY);

        moveX = e.pageX - 200
        moveY = e.pageY - 140

        if ((count % 2)) {
            oGC.clearRect(0, 0, 3000, 2500)
            for (let i in canvasDate[fileName]) {
                rect(oGC, canvasDate[fileName][i][0], canvasDate[fileName][i][1], canvasDate[fileName][i][2], canvasDate[fileName][i][3], canvasDate[fileName][i][7]);
            }
            distanceX = moveX - startX
            distanceY = moveY - startY
            $('.mousePosition').html('X: ' + distanceX + '\n' + 'Y:' + distanceY)
            rect(oGC, startX / scale, startY / scale, distanceX / scale, distanceY / scale, scale);

        }
        // $('.mousePosition').html($("fileList").height());
    }).click(function (e) {
        if (start) {

            cat = $(".category option:checked").val();
            if ($(".category option:checked").length != 1) {
                alert('只能选择一个类别')
                return
            }

            if (!cat) {
                alert('请先添加或选择一个类别')
                return
            }

            if (isResize) {
                var point = $('<img class="point" id="' + currentResizePointId + '" src = "img/Mapicon.png">');
            } else {
                var point = $('<img class="point" id="' + count + '" src = "img/Mapicon.png">');
            }
            point.css({
                "left": +e.pageX - 17,
                "top": +e.pageY - 35
            });
            point.appendTo("body");
            point.fadeIn();

            if (!(count % 2)) {
                startX = e.pageX - 200
                startY = e.pageY - 140
            } else {
                endX = e.pageX - 200
                endY = e.pageY - 140
                $(".point").animate({
                    opacity: '0'
                }, 1000);
                if (isResize) {
                    if (isReverse) {

                        canvasDate[fileName][currentResizeNum] = [startX / scale, startY / scale, distanceX / scale, distanceY / scale, endX / scale, endY / scale, cat, scale]
                    } else {
                        console.log('调换')
                        canvasDate[fileName][currentResizeNum] = [endX / scale, endY / scale, -distanceX / scale, -distanceY / scale, startX / scale, startY / scale, cat, scale]
                    }
                    isResize = false
                } else {
                    // if( distanceY < 0) {
                    // canvasDate[fileName].push([endX/scale, endY/scale, -distanceX/scale, -distanceY/scale, startX/scale, startY/scale, cat, scale])

                    // }
                    // else {
                    canvasDate[fileName].push([startX / scale, startY / scale, distanceX / scale, distanceY / scale, endX / scale, endY / scale, cat, scale])

                    // }
                }
                console.log(canvasDate)

                recordIn = '';
                record = '';
                for (i = 0; i < canvasDate[fileName].length; i++) {
                    record += canvasDate[fileName][i][6] + ' '
                    record += (+canvasDate[fileName][i][0]).toFixed(0) + ' '
                    record += (+canvasDate[fileName][i][1]).toFixed(0) + ' '
                    record += (+canvasDate[fileName][i][4]).toFixed(0) + ' '
                    record += (+canvasDate[fileName][i][5]).toFixed(0) + ' '

                }

                recordIn = fileName + " " + canvasDate[fileName].length + " " + record;
                $("#mark").val(recordIn);
            }
            count++

            // record = record.slice(0,file_len) + record.slice(file_len+)
            // record += ((+(e.pageX ) - 200)/scale).toFixed(0) + " " + ((+(e.pageY ) - 140)/scale).toFixed(0) + " ";

        }

    });

    $("body").on('mouseenter mouseleave', '.point', function (event) {
        if (event.type == "mouseenter") {
            $(this).animate({
                opacity: '1'
            }, 00);
        } else if (event.type == "mouseleave") {
            $(this).animate({
                opacity: '0'
            }, 00);
        }
    })

    var isReverse;
    $("body").on('click', '.point', function (event) {
        if (count % 2 != 0) return
        $(this).remove()
        isResize = true
        console.log($(this)[0].id)
        currentResizePointId = $(this)[0].id
        currentResizeNum = Math.floor($(this)[0].id / 2)

        if ($(this)[0].id % 2) {
            isReverse = true
            startX = canvasDate[fileName][currentResizeNum][0] * scale
            startY = canvasDate[fileName][currentResizeNum][1] * scale
        } else {
            isReverse = false
            startX = canvasDate[fileName][currentResizeNum][4] * scale
            startY = canvasDate[fileName][currentResizeNum][5] * scale
        }
        canvasDate[fileName][currentResizeNum] = [];
        count--

    });

    $("#fileList").on("click", "option", function () {
        console.log('onchange')
        // $("option").click(function(){
        record = '';
        recordIn = '';
        if ($('#auto').prop('checked')) {
            start = true;
        } else {
            start = false;
        }
        if (!listCount) {
            listCount = $("#fileList option").index($(this));
        }

        fileName = $(this).val();
        //初始化列表框
        recordIn = fileName + " " + 0

        if (canvasDate[fileName].length) {
            for (i = 0; i < canvasDate[fileName].length; i++) {
                record += canvasDate[fileName][i][6] + ' '
                record += (+canvasDate[fileName][i][0]).toFixed(0) + ' '
                record += (+canvasDate[fileName][i][1]).toFixed(0) + ' '
                record += (+canvasDate[fileName][i][4]).toFixed(0) + ' '
                record += (+canvasDate[fileName][i][5]).toFixed(0) + ' '

            }
            recordIn = fileName + " " + canvasDate[fileName].length + " " + record;
        }

        $("#mark").val(recordIn);

        count = 0;
        $("#preview").attr("src", "data/" + fileName);
        $(".point").remove()

        // });
    });
    $('#upload').change(function () {

        if ($('#auto').prop('checked')) {
            start = true;
        } else {
            start = false;
        }
        fileName = $('#upload')[0].files[0].name + "  ";

        count = 0;

        $("#preview").attr("src", "data/" + fileName);
    });

    function getNaturalWidth(img) {
        var image = new Image()
        image.src = img.src
        var naturalWidth = image.width
        return naturalWidth
    }

    function getNaturalHeight(img) {
        var image = new Image()
        image.src = img.src
        var naturalHeight = image.height
        return naturalHeight
    }

    function rect(context, x, y, x2, y2, scale) { // x,y是坐标;a是半径
        context.beginPath();
        context.rect(x * scale, y * scale, x2 * scale, y2 * scale)
        context.closePath();
        context.stroke();
    }

    // $("#fileListInput").val('desktop.jpg\nBG1.jpg');

    // $("#genFileList").click();

    $("#file").on("change", function () {
        // console.log(files)
        var files = $(this)[0].files
        if (files.length) {
            var file = files[0];
            var reader = new FileReader();
            if (/text\/\w+/.test(file.type)) {
                reader.onload = function () {
                    var regExName = /\w+\.\w+/gm
                    nameArr = this.result.match(regExName)
                    resultArr = this.result.split('\n')

                    for (let item = 0; item < resultArr.length; item++) {
                        var regExG = /(\w+\.\w+)\s(\d)(.*)/g
                        var matches = regExG.exec(resultArr[item])
                        if (matches) {
                            var regExRect = /[a-zA-Z]+(\s[\d]+){4}/g
                            var matchRect
                            while ((matchRect = regExRect.exec(matches[3])) != null) {
                                let scale = 1
                                let cat = matchRect[0].split(' ')[0]
                                let startX = matchRect[0].split(' ')[1]
                                let startY = matchRect[0].split(' ')[2]
                                let endX = matchRect[0].split(' ')[3]
                                let endY = matchRect[0].split(' ')[4]
                                let distanceX = endX - startX
                                let distanceY = endY - startY
                                if (categoryArr.indexOf(cat) === -1) {
                                    categoryArr.push(cat)
                                }
                                if (!canvasDate[nameArr[item]]) {
                                    canvasDate[nameArr[item]] = []
                                }
                                canvasDate[nameArr[item]].push([startX, startY, distanceX, distanceY, endX, endY, cat, scale])
                            }
                        }

                    }
                    if (categoryArr) {
                        for (var i = 0; i < categoryArr.length; i++) {
                            var newCateDom = $('<option value="' + categoryArr[i] + '">' + categoryArr[i] + '</option>')
                            // newCateDom.selected = 'true'
                            $(".category").append(newCateDom);
                            $(".category :last-child").attr('selected', 'selected').siblings().attr('selected', false)
                        }
                    }

                    $("#fileListInput").val(nameArr.join('\n'));

                    $("#genFileList").click();
                }
                reader.readAsText(file);
            } else if (/image\/\w+/.test(file.type)) {
                reader.onload = function () {
                    $('<img src="' + this.result + '"/>').appendTo('body');
                }
                reader.readAsDataURL(file);
            }
        }
    })

    // $("#fileListInput").val('desktop.jpg')
    // $("#genFileList").click();

    $("#addCate").click(function () {
        var newCate = $(".newCateInput").val()
        if (newCate) {
            categoryArr.push(newCate);

            var newCateDom = $('<option value="' + newCate + '">' + newCate + '</option>')
            // newCateDom.selected = 'true'
            $(".category").append(newCateDom);
            if ($(".category option:selected")[0]) {
                $(".category option:selected")[0].selected = ''
            }
            $(".category :last-child").attr('selected', 'selected').siblings().attr('selected', false)
            $(".newCateInput").val('')
        }
    })

    //从 localstorage 初始化 category
    var categoryArr = [];
    //
    //
    //
    // 	for (var i = 0; i < categoryArr.length; i++) {
    // 		var newCateDom = $('<option value="'+ categoryArr[i] +'">'+ categoryArr[i] +'</option>')
    // 		$(".category").append(newCateDom);
    // 		$(".category :last-child").attr('selected','selected').siblings().attr('selected',false)
    // 	}

    $("#delCate").click(function () {
        let delVal = $(".category option:checked").val()
        categoryArr.remove(delVal)
        var preCurrChecked = $(".category option:checked").next().length ? $(".category option:checked").next() : $(".category option:checked").prev()

        $(".category option:checked").remove()
        if (preCurrChecked.length) {
            preCurrChecked[0].selected = 'selected'

        }

    })

    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

});
