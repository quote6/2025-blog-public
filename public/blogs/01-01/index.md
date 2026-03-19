花了两天时间，终于把《东方大炮弹》的早苗live2d模型部署到自己的网站了。部署这个东方角色的live2d模型的一个最大问题就是，存在多个手部部件重叠显示的问题。大部分的搭建时间多是花在这个上面了。
首先先贴一个Github上大佬分享的《东方大炮弹》的角色live2d文件的链接吧。非常感谢大佬的分享
> [TouhouCannonBall-Live2d-Models](https://github.com/n0099/TouhouCannonBall-Live2d-Models)

还有就是本网站搭建live2d使用到的一个开源项目
[pixi-live2d-display](https://github.com/guansss/pixi-live2d-display/tree/master)
以及它的API文档
[pixi-live2d-display - v0.4.0](https://guansss.github.io/pixi-live2d-display/api/index.html)
其实在这个项目的issue里就有人提到了关于东方角色的live2d模型部署的时候出现的手部显示不正常的问题。

[Fixed a bug where the PartOpacity property did not work properly](https://github.com/guansss/CubismWebFramework/pull/1)

[能否隐藏或者显示模型的某一个部分？](https://github.com/guansss/pixi-live2d-display/issues/64)

[Multiple overlapping hands with the default value false of config.cubism4.setOpacityFromMotion](https://github.com/guansss/pixi-live2d-display/issues/131)

上面的最后一个链接就是分享东方角色live2d的大佬提到这种问题的解决方案。虽然不完美，但好在至少能正常显示了。
按照上面的大佬的方案，虽然解决了手部部件重叠显示的问题，但是并不稳定，有些时候，在刷新页面的时候，live2d模型又会显示异常，好在这种情况的概率比较低，暂时就这样了。如果想真正且完美的解决的话可能就需要好好学习一下live2d的相关知识，我觉得很有可能需要自己用live2d Cubism Editor来重新制作这个模型。所以还是又好多东西需要学习啊，不过本次折腾也收获颇丰。很开心