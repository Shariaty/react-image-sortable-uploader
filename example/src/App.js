import React from 'react'

import { SortableUploader } from 'react-image-sortable-uploader'
import 'react-image-sortable-uploader/dist/index.css'

const App = () => {
  return <div style={{padding: 50}}>
            <SortableUploader
              header='Photo Gallery'
              title='Upload at least 1 photo'
              subTitle="You`ll also be able to upload more after registration"
              urlUpload='https://test.com/image/upload'
              urlDelete='https://test.com/image/remove'
              editMode={true}
              Identifier={555}
              onEdit={(editData) => console.log(editData)}
              onSort={(sortedData) => console.log(sortedData)}
              theme='blue'/>
        </div>
}

export default App
