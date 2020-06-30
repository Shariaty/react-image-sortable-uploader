# react-image-sortable-uploader

> A package to upload and manage the order of pictures

[![NPM](https://img.shields.io/npm/v/react-image-sortable-uploader.svg)](https://www.npmjs.com/package/react-image-sortable-uploader) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-image-sortable-uploader
```

## Usage

```jsx
import React, { Component } from 'react';
import { SortableUploader } from 'react-image-sortable-uploader'
import 'react-image-sortable-uploader/dist/index.css'
import axios from "axios";

const PROP_ID = '4c705a9e-dd1a-463d-868f-6f3fcab32f6b'
const TOKEN = '13f0bc75-49a0-46e8-b6ed-2bac6b0d41e6'
const STATIC_URL = 'http://example.com'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      inProgress: false
    };
  }

  componentDidMount() {
    // Set the authorization token if neccesary , if not remove
    axios.defaults.headers.common['UserToken'] = TOKEN;
    
    // Get the pictures of an entity inorder to load inside gallery
    this._getPhotos();
  }

  _getPhotos = () => {
    const url = STATIC_URL+'/api/HotelPhotos/GalleryList?propId='+PROP_ID;

    this.setState({inProgress: true});
    axios.get(url)
      .then( response => {
        if (response.data && response.data.length){
          // Map the result to change it to prefered format
          response.data.map( (item) => {
            item.url = STATIC_URL+item.url;
          })
        }
        this.setState({images: response.data , inProgress: false} );
      })
      .catch( error =>  {
        this.setState({inProgress: false});
      });
  }

  _handleSort = (sortedData) => {
    const url = STATIC_URL+'/api/HotelPhotos/PhotoSort';

    if (sortedData && sortedData.length){
      let newData = [];
      // Map the sorted data to match with your Api endpoint
      sortedData.map( (item , index) => {
          newData.push({
            ImageId: item.id,
            NewOrder: index
          });
      })

      // create form data or in your case generate a raw json acceotable for your API endpoint
      let formData = new FormData();
      formData.append('propId',PROP_ID);
      formData.append('Images', JSON.stringify(newData));

      this.setState({inProgress : true});
      
      // Call the API in order to save the new sorting
      axios.post(url , formData)
        .then( response => {
          this.setState({inProgress: false} );
        })
        .catch( error =>  {
          this.setState({inProgress: false});
        });
    }
  }

  render() {
    let { images , inProgress } = this.state;
    return (
      <div>
        <div style={{padding: 50}}>
          <SortableUploader
            Identifier={PROP_ID}
            header='Photo Gallery'
            title='Upload at least 1 photo'
            subTitle="You`ll also be able to upload more after registration"
            urlUpload='http://example.com/api/HotelPhotos/UploadPhoto'
            urlDelete='http://example.com/api/HotelPhotos/DeletePhoto'
            editMode={false}
            onEdit={(editData) => console.log(editData)}
            onSort={(sortedData) => this._handleSort(sortedData)}
            theme='blue'
            images={images}
            loading={inProgress}
          />
        </div>
      </div>
    );
  }

}

export default App;
```

## Props
| Prop       | Type       |  Accepted values  | Description   |
| :--------- |:----------:|:------------:|:--------------:|
| identifier | String/Int  |  555 |  Identifier to send with the upload request in order to upload multiple images for an specific entity (such as product_id) |
| header     | String      | Any string |  string to display as the header of the component |
| title      | String      | Any string |  string to display as the header of the component |
| subTitle   | String      | Any string |  string to display as the header of the component |
| urlUpload  | String URL |  example: 'https://test.com/gallery/upload' |  Url endpoint to upload image in server |
| urlDelete  | String URL |  example: 'https://test.com/gallery/remove' |  Url endpoint to delete image in server |
| editMode   | Boolean    |  true/false |  enable edit button on each picture |
| onEdit     | Function   |  (editData) => console.log(editData) | function to lunch on edit button clicked (can be customized as you like) |
| onSort     | Function   |  (sortedData) => console.log(sortedData) | function to lunch on sort finished ( array of images with their new index in order to update it on the server or manipulate as you prefer) |
| theme      | String      |  'blue/red' | change the the color theme of the uploader in order to suits your design |
| images     | Array      |  Array of images objects | Array of images objects to set in gallery on load |
| loading     | Boolean      |  true/false | State of gallery loading, It is used to show gallery are doing something like sorting etc. |


## Accepted images format
```jsx
let images = [
  { id: '5555' , url: 'http://www.example.com/images/5555.jpg' },
  { id: '6666' , url: 'http://www.example.com/images/6666.jpg' },
]
```

## Upload image
```jsx
Sends a post Request to given "urlUpload" with "identifier" and image file as a formData , excpect to recieve Html status code 200 on success and othe such as 401 on failed.
There is also a prefabricated format for recieving messeges from the response from the API.

Request (formData) = {
    "image": (binary)
    "propId": '555' // The identifier prop
}

FailedResponse = {
   "ReportModel": {
       "Messages": [
           "Please try again",
           "images format is not supported."
       ]
   },
   "PhotoId": null
}

SuccessResponse = {
   "ReportModel": {
       "Messages": []
   },
   "PhotoId": '5555' // ID of the uploaded image, essential for deleting the image
}

```

## Delete image
```jsx
Sends a post Request to given "urlDelete" with "identifier" if available, excpect to recieve Html status code 200 on success and othe such as 401 on failed.

Request (formData) = {
    "ImageId": '666' // The id of the image
    "propId": '555' // The identifier prop
}
```
## License

MIT © [Shariaty](https://github.com/Shariaty)
