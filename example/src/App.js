import React, { Component } from 'react';
import { SortableUploader } from 'react-image-sortable-uploader'
import 'react-image-sortable-uploader/dist/index.css'
import axios from "axios";

const PROP_ID = '4c705a9e-dd1a-463d-868f-6f3fcab32f6b'
const ADDITIONAL_ID = '5555'
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

      formData.append('propId', ADDITIONAL_ID ? ADDITIONAL_ID : PROP_ID);
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
            AdditionalIdentifierName='test'
            AdditionalIdentifierValue={ADDITIONAL_ID}
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
