export const loadAvatar = (sprite, path) => {
  //   if (global.DEV_MODE) {
  //     return;
  //   }

  var myUrl = "https://cdn.torofun.com/images/avatar/users/" + path + ".png";
  var img = new Image();
  img.src = myUrl;
  img.crossOrigin = "anonymous";
  var texture = new cc.Texture2D();
  texture.initWithElement(img);
  texture.handleLoadedTexture();
  sprite.spriteFrame = new cc.SpriteFrame(texture);
};