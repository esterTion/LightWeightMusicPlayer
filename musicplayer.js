/*
 *
 * config参数，object类型
  	element：附加到的父元素
  	color：颜色，带#的hex颜色值或rgba()
  		played：已播放部分
  		buffered：已缓冲部分
  		blank：未缓冲部分
 *
 */
MusicPlayer=function(config){
	'use strict';
	if(!config.element || !config.src)
		return false;
	this.element=config.element;
	this.config=config;
	if(document.getElementById(this.config.id||'')!=null){
		console.warn('existing element id, ignoring and generating new id');
		delete this.config.id;
	}
	var defaultConfig={
		color:{
			played:'#FFFFFF',
			buffered:'#C8C7C7',
			blank:'#918F8F',
			border:'#000000'
		},
		id:'MusicPlayer_'+Date.now(),
		borderWidth:0,
		autoPlay:false,
		loop:false
	},
	div=document.createElement('div'),k1,k2;
	/* 一级默认参数 */
	for(k1 of ['id','borderWidth','autoPlay','loop']){
		this.config[k1]=this.config[k1]||defaultConfig[k1]
	}
	/* 二级默认参数 */
	for(k1 of ['color']){
		if(this.config[k1]==undefined){
			this.config[k1]=defaultConfig[k1];
			break;
		}
		for(k2 in defaultConfig[k1]){
			this.config[k1][k2]=this.config[k1][k2]||defaultConfig[k1][k2];
		}
	}
	div.id=this.config.id
	this.element.appendChild(div);
	div.innerHTML='<div class="warpper"><div class="buffered"></div><div class="played"></div><div class="icon"></div>'+
		'<style>'+
			'#'+this.config.id+'{height:20px;width:100%;position:relative;background:'+this.config.color.border+';cursor:pointer}'+
			'#'+this.config.id+' .warpper{background:'+this.config.color.blank+';position:absolute;left:'+this.config.borderWidth+';right:'+this.config.borderWidth+';top:'+this.config.borderWidth+';bottom:'+this.config.borderWidth+'}'+
			'#'+this.config.id+' .buffered{position:absolute;height:100%;background:'+this.config.color.buffered+'}'+
			'#'+this.config.id+' .played{position:absolute;height:100%;background:'+this.config.color.played+'}'+
			'#'+this.config.id+' .icon{position:absolute;height:18px;left:50%;right:50%;opacity:0.5}'+
		'</style>'+
		'<audio src="'+this.config.src+'"></audio></div>';
	this.container=document.getElementById(this.config.id);
	this.barPlay=document.querySelector('#'+this.config.id+' .played');
	this.barBuffer=document.querySelector('#'+this.config.id+' .buffered');
	this.audio=document.querySelector('#'+this.config.id+' audio');
	this.svgIcon=document.querySelector('#'+this.config.id+' .icon');
	var self=this;
	this.listeners={
		timeupdate:function(e){
			self.barPlay.style.width=(this.currentTime/this.duration*100)+'%';
			try{
				var s,e,i=0;
				for(;i<this.buffered.length;i++){
					if( this.currentTime>this.buffered.start(i) && this.currentTime<this.buffered.end(i) ){
						s=this.buffered.start(i);
						e=this.buffered.end(i);
						break;
					}
				}
				if(i==this.buffered.length)
					throw 'Not Range Found';
				self.barBuffer.style.width=(e/this.duration)*100+'%';
			}catch(e){
				return;
			}
		},
		progress:function(e){
			try{
				var s,e,i=0;
				for(;i<this.buffered.length;i++){
					if( this.currentTime>this.buffered.start(i) && this.currentTime<this.buffered.end(i) ){
						s=this.buffered.start(i);
						e=this.buffered.end(i);
						break;
					}
				}
				if(i==this.buffered.length)
					throw 'Not Range Found';
				self.barBuffer.style.width=(e/this.duration)*100+'%';
			}catch(e){
				return;
			}
		},
		click:function(e){
			if(self.audio.paused){
				self.audio.play();
			}else{
				self.audio.pause();
			}
		},
		play:function(e){
			self.svgIcon.innerHTML=self.resource.pause;
		},
		pause:function(e){
			self.svgIcon.innerHTML=self.resource.play;
		}
	}
	this.audio.addEventListener('timeupdate',this.listeners.timeupdate);
	this.audio.addEventListener('progress',this.listeners.progress);
	this.audio.addEventListener('play',this.listeners.play);
	this.audio.addEventListener('pause',this.listeners.pause);
	this.container.addEventListener('click',this.listeners.click);
	if(this.config.autoPlay){
		this.listeners.click();
	}
	if(this.config.loop){
		this.audio.loop=1;
	}
}
MusicPlayer.prototype.resource={
	play:'<svg style="width:18px;height:18px"><polygon style="fill:#333;stroke:#FFF" points="2,2 2,16 16,9"></polygon></svg>',
	pause:'<svg style="width:18px;height:18px"><polygon style="fill:#333;stroke:#FFF" points="2,2 2,16 8,16 8,2"></polygon><polygon style="fill:#333;stroke:#FFF" points="10,2 10,16 16,16 16,2"></polygon></svg>'
}