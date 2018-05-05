# Light Weight Music Player


Author: esterTion

---

A quick demo can be found [here](https://estertion.github.io/LightWeightMusicPlayer/demo.htm)

---

## Parameter

MusicPlayer accepts an object with following properties as parameter
 * element: The element to attach (required)
 * src: The audio file URL to play (required)
 * id: The id of generated div
 * borderWidth: The border width of div
 * autoPlay: Automatic starts play after summoned (won't work on mobile device)
 * loop: Loops the playback
 * color: An object with optional color defination for parts, including "played" "buffered" "blank" and "border"

---

### Default config
This will be overwrote by config passed to the function

```Javascript
{
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
}
```

---

### Example config

```Javascript
{
	element:document.getElementById('music_container'),
	src:'https://estertion.win/DREAMCATCHER.m4a',
	id:'LightWeightPlayer',
	borderWidth:'1px',
	autoPlay:true,
	loop:true,
	color:{
		played:'#E05959',
		buffered:'#FFA7A7',
		blank:'#EEE',
		border:'#DDD'
	}
}
```

---
# 中文

## 轻量级音乐播放器

示例页面在[这里](https://estertion.github.io/LightWeightMusicPlayer/demo.htm)

---

## 参数

MusicPlayer接收一个包含以下属性的对象为参数
 * element: 要附属到的元素 (必须)
 * src: 要播放的音频文件URL (必须)
 * id: div的id
 * borderWidth: div的边框宽度
 * autoPlay: 生成后自动开始播放(移动端不可实现)
 * loop: 洗脑循环
 * color: 带可选值的对象, 包括 "played" "buffered" "blank" 和 "border"
