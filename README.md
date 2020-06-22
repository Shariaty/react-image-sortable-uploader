# react-image-sortable-uploader

> A package to upload and manage the order of pictures

> :warning: ** This package is still under development and it is not suitable for use, It will be completed by the next 14 days. Please try not to use it until this message been removed

[![NPM](https://img.shields.io/npm/v/react-image-sortable-uploader.svg)](https://www.npmjs.com/package/react-image-sortable-uploader) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-image-sortable-uploader
```

## Usage

```jsx
import React, { Component } from 'react'

import { SortableUploader } from 'react-image-sortable-uploader'
import 'react-image-sortable-uploader/dist/index.css'

class Example extends Component {
  render() {
    return <SortableUploader
                 header='Header Text'
                 title='Title Text'
                 subTitle="Subtitle Text"
                 urlUpload='https://test.com/image/upload'
                 urlDelete='https://test.com/image/remove'
                 identifier={555}
                 editMode={true}
                 onEdit={(editData) => console.log(editData)}
                 onSort={(sortedData) => console.log(sortedData)}
                 theme='blue'/>
  }
}
```
## Props
| Prop       | Type       |  Accepted values  | Description   |
| :--------- |:----------:|:------------:|:--------------:|
| header     | String      | Any string |  string to display as the header of the component |
| title      | String      | Any string |  string to display as the header of the component |
| subTitle   | String      | Any string |  string to display as the header of the component |
| urlUpload  | String URL |  example: 'https://test.com/gallery/upload' |  Url endpoint to upload image in server |
| urlDelete  | String URL |  example: 'https://test.com/gallery/remove' |  Url endpoint to delete image in server |
| identifier | String/Int  |  555 |  Identifier to send with the upload request in order to upload multiple images for an specific entity (such as product_id) |
| editMode   | Boolean    |  true/false |  enable edit button on each picture |
| onEdit     | Function   |  (editData) => console.log(editData) | function to lunch on edit button clicked (can be customized as you like) |
| onSort     | Function   |  (sortedData) => console.log(sortedData) | function to lunch on sort finished ( array of images with their new index in order to update it on the server or manipulate as you prefer) |
| theme      | String      |  'blue/red' | change the the color theme of the uploader in order to suits your design |


## License

MIT © [Shariaty](https://github.com/Shariaty)
