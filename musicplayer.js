/*
 *
 * config参数，object类型
  	element：附加到的父元素
  	color：颜色，带#的hex颜色值或rgba()
  		played：已播放部分
  		buffered：已缓冲部分
  		blank：未缓冲部分
  		border：边框
  	id：容器id
  	borderWidth：边框宽度
  	autoPlay：自动播放
  	loop：循环
 *
 */
window.MusicPlayer = function (config) {
	'use strict';
	if (!config.element || !config.src)
		return false;
	this.element = config.element;
	this.config = config;
	if (document.getElementById(this.config.id || '') != null) {
		console.warn('existing element id, ignoring and generating new id');
		delete this.config.id;
	}
	var resource = {
		play: '<svg style="width:18px;height:18px"><polygon style="fill:#333;stroke:#FFF" points="2,2 2,16 16,9"></polygon></svg>',
		pause: '<svg style="width:18px;height:18px"><polygon style="fill:#333;stroke:#FFF" points="2,2 2,16 8,16 8,2"></polygon><polygon style="fill:#333;stroke:#FFF" points="10,2 10,16 16,16 16,2"></polygon></svg>'
	};
	var defaultConfig = {
		color: {
			played: '#FFFFFF',
			buffered: '#C8C7C7',
			blank: '#918F8F',
			border: '#000000'
		},
		id: 'MusicPlayer_' + Date.now(),
		borderWidth: 0,
		autoPlay: false,
		loop: false
	},
		div = document.createElement('div'), k1, k2;
	/* 一级默认参数 */
	['id', 'borderWidth', 'autoPlay', 'loop'].forEach(function (k1) {
		this.config[k1] = this.config[k1] || defaultConfig[k1];
	});
	/* 二级默认参数 */
	['color'].forEach(function (k1) {
		if (this.config[k1] == undefined) {
			this.config[k1] = defaultConfig[k1];
			return;
		}
		for (k2 in defaultConfig[k1]) {
			this.config[k1][k2] = this.config[k1][k2] || defaultConfig[k1][k2];
		}
	});
	div.id = this.config.id;
	if (typeof (this.config.borderWidth) != 'string')
		this.config.borderWidth = this.config.borderWidth + 'px';
	this.element.appendChild(div);
	div.innerHTML = '<div class="warpper"><div class="buffered"></div><div class="played"></div><div class="icon">' + resource.play + '</div>' +
		'<style>' +
		'#' + this.config.id + '{height:20px;width:100%;position:relative;background:' + this.config.color.border + ';cursor:pointer;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none}' +
		'#' + this.config.id + ' .warpper{background:' + this.config.color.blank + ';position:absolute;left:' + this.config.borderWidth + ';right:' + this.config.borderWidth + ';top:' + this.config.borderWidth + ';bottom:' + this.config.borderWidth + '}' +
		'#' + this.config.id + ' .buffered{position:absolute;height:100%;background:' + this.config.color.buffered + ';transition:width .5s}' +
		'#' + this.config.id + ' .played{position:absolute;height:100%;background:' + this.config.color.played + ';transition:width .5s}' +
		'#' + this.config.id + ' .icon{height:18px;width:18px;margin:0 auto;opacity:0.5}' +
		'</style>' +
		'<audio src="' + this.config.src + '"></audio></div>';
	this.container = document.getElementById(this.config.id);
	this.barPlay = document.querySelector('#' + this.config.id + ' .played');
	this.barBuffer = document.querySelector('#' + this.config.id + ' .buffered');
	this.audio = document.querySelector('#' + this.config.id + ' audio');
	this.svgIcon = document.querySelector('#' + this.config.id + ' .icon');
	var self = this;
	this.updateTime = function (p) {
		this.barPlay.style.width = p + '%';
	};
	var dragging = !1,
		dragged = !1,
		touchDevice = false;
	this.listeners = {
		timeupdate: function () {
			if (!dragging)
				self.updateTime(this.currentTime / this.duration * 100);
			try {
				var s, e, i = 0;
				for (; i < this.buffered.length; i++) {
					if (this.currentTime > this.buffered.start(i) && this.currentTime < this.buffered.end(i)) {
						s = this.buffered.start(i);
						e = this.buffered.end(i);
						break;
					}
				}
				if (i == this.buffered.length)
					throw 'Not Range Found';
				self.barBuffer.style.width = (e / this.duration) * 100 + '%';
			} catch (e) {
				return;
			}
		},
		progress: function () {
			try {
				var s, e, i = 0;
				for (; i < this.buffered.length; i++) {
					if (this.currentTime > this.buffered.start(i) && this.currentTime < this.buffered.end(i)) {
						s = this.buffered.start(i);
						e = this.buffered.end(i);
						break;
					}
				}
				if (i == this.buffered.length)
					throw 'Not Range Found';
				self.barBuffer.style.width = (e / this.duration) * 100 + '%';
			} catch (e) {
				return;
			}
		},
		click: function (e) {
			console.log('click');
			if (dragged) return;
			if (self.audio.paused) {
				self.audio.play();
			} else {
				self.audio.pause();
			}
		},
		play: function (e) {
			self.svgIcon.innerHTML = resource.pause;
		},
		pause: function (e) {
			self.svgIcon.innerHTML = resource.play;
		},
		mousedown: function (e) {
			console.log('mousedown');
			if (touchDevice) return;
			dragging = !0;
			dragged = false;
			self.barPlay.style.transitionDuration = '0s';
		},
		mousemove: function (e) {
			if (touchDevice) return;
			if (dragging) {
				console.log('mousemove');
				dragged = !0;
				var border = parseInt(self.config.borderWidth);
				if (isNaN(border))
					border = 0;
				var p = (e.layerX - border) / (self.container.offsetWidth - 2 * border) * 100;
				p = (p > 100) ? 100 : p < 0 ? 0 : p;
				self.updateTime(p);
			}
		},
		mouseup: function (e) {
			if (touchDevice) return;
			console.log('mouseup');
			dragging = !1;
			self.barPlay.style.transitionDuration = '';
			if (dragged) {
				e.preventDefault();
				self.audio.currentTime = parseFloat(self.barPlay.style.width) * self.audio.duration / 100;
			}
		},
		touchstart: function (e) {
			touchDevice = true;
			dragging = !0;
			dragged = false;
			var bounding = self.barPlay.getBoundingClientRect();
			self.oldTouch = [e.touches[0].clientX - bounding.left, e.touches[0].clientY - bounding.top];
			self.barPlay.style.transitionDuration = '0s';
		},
		touchmove: function (e) {
			var bounding = self.barPlay.getBoundingClientRect(),
				containerBounding = this.getBoundingClientRect(),
				pos = [e.changedTouches[0].clientX - bounding.left, e.changedTouches[0].clientY - bounding.top];
			//Vertical scrolling, ignore
			if (pos[0] == self.oldTouch[0] && !dragged) {
				return;
			}
			//If touch moves out of container, stop tracking
			if (pos[0] >= 0 && pos[1] >= 0 && pos[0] <= containerBounding.width && pos[1] <= containerBounding.height) {
				self.barPlay.style.transitionDuration = '0s';
				dragging = !0;
			} else {
				self.barPlay.style.transitionDuration = '';
				dragging = !1;
				return;
			}
			e.preventDefault();
			dragged = !0;
			var border = parseInt(self.config.borderWidth);
			if (isNaN(border))
				border = 0;
			var p = (pos[0]) / (self.container.offsetWidth - 2 * border) * 100;
			p = (p > 100) ? 100 : ((p < 0) ? 0 : p);
			self.updateTime(p);
		},
		touchend: function (e) {
			if (dragging && dragged) {
				self.audio.currentTime = parseFloat(self.barPlay.style.width) * self.audio.duration / 100;
			}
			dragging = !1;
			delete self.oldTouch;
			self.barPlay.style.transitionDuration = '';
		}
	};
	this.audio.addEventListener('timeupdate', this.listeners.timeupdate);
	this.audio.addEventListener('progress', this.listeners.progress);
	this.audio.addEventListener('play', this.listeners.play);
	this.audio.addEventListener('pause', this.listeners.pause);
	this.container.addEventListener('click', this.listeners.click);
	this.container.addEventListener('mousedown', this.listeners.mousedown);
	window.addEventListener('mousemove', this.listeners.mousemove);
	window.addEventListener('mouseup', this.listeners.mouseup);
	this.container.addEventListener('touchstart', this.listeners.touchstart);
	this.container.addEventListener('touchmove', this.listeners.touchmove);
	this.container.addEventListener('touchend', this.listeners.touchend);
	if (this.config.autoPlay) {
		this.listeners.click();
	}
	if (this.config.loop) {
		this.audio.loop = 1;
	}
};