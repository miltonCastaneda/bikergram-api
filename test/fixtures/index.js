export default {
  getImage () {
    return {
      id: '8794cac8-1cc2-4012-9995-c81e0bf944da',
      publicId: '47PXFcf7OiZlHOEVskXSIO',
      userId: 'bikergram',
      liked: false,
      likes: 0,
      src: 'https://s3-sa-east-1.amazonaws.com/bikergram/1494955138964.jpg',
      description: '#awesome',
      tags: [ 'awesome' ],
      createdAt: new Date().toString()
    }
  },

  getImages () {
    return [
      this.getImage(),
      this.getImage(),
      this.getImage()
    ]
  },

  getImagesByTag () {
    return [
      this.getImage(),
      this.getImage()
    ]
  },

  getUser () {
    return {
      id: '8794cac8-1cc2-4012-9995-c81e0bf944da',
      name: 'Milton Castañeda',
      username: 'Milton',
      email: 'm@bikergram.test',
      password: 'bikergram',
      createdAt: new Date().toString()
    }
  }
}
