import React from 'react'

import { SortableUploader } from 'react-image-sortable-uploader'
import 'react-image-sortable-uploader/dist/index.css'

const App = () => {
  return <SortableUploader
          header='Header Text'
          title='Title Text'
          subTitle="Subtitle Text"
          urlUpload='https://test.com/image/upload'
          urlDelete='https://test.com/image/remove'
          editMode={true}
          Identifier={555}
          // onEdit={(sortedData) => console.log(sortedData)}
          onSort={(sortedData) => console.log(sortedData)}
          theme='blue'/>
}

export default App
