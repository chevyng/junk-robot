export default{
  base: {
    width: 80,
    height: 100
  },
  lefteye: {
    x: (80 / 3.5) , // Width / 3.5
    y: (100 / 4),  // Height / 4
    radius: 8
  },
  righteye: {
    x: (80 - (80 / 3.5)) , // Width - ( Width / 3.5 )
    y: (100 / 4),         // Height / 4
    radius: 8
  }
};
