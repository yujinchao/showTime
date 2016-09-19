//阻止默认行为
$(document).on('touchmove',function(ev){
	ev.preventDefault();
});
//解决click事件300ms延迟的问题
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function () {
		FastClick.attach(document.body);
	}, false);
}
//自动设置rem根值
~function (desW) {
	var winW = document.documentElement.clientWidth;
	document.documentElement.style.fontSize = winW / desW * 10 + "px";
}(750);
//设置音乐播放转换
~function () {
	var music = document.getElementById("music"), audioFir = document.getElementById("audioFir");

	//->给页面的加载缓冲500MS时间
	window.setTimeout(function () {
		audioFir.play();

		//->当音频文件可以播放(出声了)的时候:canplay/canplaythrough
		audioFir.addEventListener("canplay", function () {
			music.style.display = "block";
			music.className = "music musicMove";
		}, false);
	}, 1000);

	//->移动端使用CLICK存在300MS的延迟
	music.addEventListener("click", function () {
		//->当前是暂停的
		if (audioFir.paused) {
			audioFir.play();
			music.className = "music musicMove";
			return;
		}
		//->当前是播放的
		audioFir.pause();
		music.className = "music";
	}, false);
}();

//实现切屏效果
$(function(){
	var $main = $('#main');
	var $li=$('#list').children('li');

	var viewHeight=$(window).height();
	
	$main.css({'height':viewHeight,'width':'100%'});
	
	//划动页面;
	slidePage();
	
	function slidePage(){
		var startY = 0;
		var step = 1/4;
		var nowIndex = 0;
		var nextorprevIndex = 0;
		var bBtn = true;
		
		//$li.css('backgroundPosition', (640 - nowViewWidth())/2 +'px 0');
		
		$li.on('touchstart',function(ev){
			if(bBtn){
				bBtn = false;
				var touch = ev.originalEvent.changedTouches[0];
				startY = touch.pageY;
				nowIndex = $(this).index();
				if(nowIndex!==2){
					$li.eq(2).get(0).firstElementChild.id=""
				}

				$li.on('touchmove.move',function(ev){
					var touch = ev.originalEvent.changedTouches[0];
					$(this).siblings().hide();
					if( touch.pageY < startY ){   //↑
						nextorprevIndex = nowIndex == $li.length-1 ? 0 : nowIndex + 1;
						$li.eq(nextorprevIndex).css('transform','translate(0,'+( viewHeight + touch.pageY - startY )+'px)');
					
					}
					else{   //↓
						nextorprevIndex = nowIndex == 0 ? $li.length-1 : nowIndex - 1;
						$li.eq(nextorprevIndex).css('transform','translate(0,'+( -viewHeight + touch.pageY - startY )+'px)');
					
					}
					$li.eq(nextorprevIndex).show().addClass('zIndex');
					
					$(this).css('transform','translate(0,'+ (touch.pageY - startY)*step +'px) ');
					
				});		
				$li.on('touchend.move',function(ev){
					var touch = ev.originalEvent.changedTouches[0];
					if( touch.pageY < startY ){   //↑
						$li.eq(nowIndex).css('transform','translate(0,'+(-viewHeight * step)+'px) ');
					}
					else{  //↓
						$li.eq(nowIndex).css('transform','translate(0,'+(viewHeight * step)+'px) ');
					}
					if(nextorprevIndex==2){
						$li.eq(nextorprevIndex).get(0).firstElementChild.id="li3Child"
					}
					$li.eq(nowIndex).css('transition','.3s');
					$li.eq(nextorprevIndex).css('transform','translate(0,0)');
					$li.eq(nextorprevIndex).css('transition','.3s');
					$li.off('.move');
				});
			}
		});
		$li.on('transitionEnd webkitTransitionEnd',function(ev){
			if(!$li.is(ev.target)){
				return;
			}
			
			resetFn();
		});
		function resetFn(){
			$li.css('transform','');
			$li.css('transition','');
			$li.eq(nextorprevIndex).removeClass('zIndex').siblings().hide();
			bBtn = true;
		}
	}

});