import React, { Component } from 'react';
import MDSpinner from "react-md-spinner";
import { ReactSortable } from "react-sortablejs";
import reject from 'lodash/reject';
import { FaEdit , FaTrash , FaCheck , FaBan , FaImage } from "react-icons/fa";
import styles from './styles.module.css';
import axios, { post } from 'axios';
import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';

class PhotoUploaderComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            sortCounter: 0
        };
    }

    _handleSubmit = (e) => {
        e.preventDefault();
        // console.log('handle uploading-', this.state.file);
    }

    _handleImageChange(e) {
        let { files } = this.state;
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            let fakeId = 'FAKE-'+Math.floor(100000 + Math.random() * 900000);
            let status = 3;
            let newID = null;

            this.setState( prevState => ({
                files: [...prevState.files,  {  file: file, url: reader.result , status: 1 , id: fakeId }]
              }) , () => {

                this._handleUpload(file).then((response) => {
                  const NewFiles = this.state.files;

                  if (response.status === 200){
                    // TODO: need to receive photo ID from database -> me.Hoseinzadeh
                    let imageUrl = response.data?.PhotoUrl;

                    if (imageUrl){
                      let splitted = imageUrl.split('/');
                      if (splitted && splitted.length && splitted.hasOwnProperty(splitted.length - 1)) {
                        newID = splitted[splitted.length - 1];
                      }
                    }
                    // end
                    status = 2;
                  } else {
                    status = 3;
                  }


                  let index = findIndex(NewFiles, function(o) { return o.id === fakeId; });
                  if (index || index === 0){
                    if (newID){
                      NewFiles[index].id = newID;
                    }
                    NewFiles[index].status = 2;
                  }
                  this.setState( { files : NewFiles });

              }).catch( error => {
                  let NewFiles = this.state.files;
                  let index = findIndex(NewFiles, function(o) { return o.id === fakeId; });

                  if (index || index === 0){
                    // Set the error message
                    if (error.response?.data?.ReportModel?.Messages) {
                      let messages = error.response?.data?.ReportModel?.Messages;
                      let finalMessage = [];

                      messages.map( item => {
                        finalMessage.push(item);
                      })

                      finalMessage = finalMessage.join(', ');
                      NewFiles[index].error = finalMessage;
                    }

                    // Set the Status
                    NewFiles[index].status = 3;
                    this.setState( { files : NewFiles });
                  }
              })

            });
        };

        reader.readAsDataURL(file);
        this.fileInput.value = "";
    }

    _handleUpload(file){
      let { Identifier , urlUpload } = this.props;

      if ( urlUpload && file) {
        const formData = new FormData();
        formData.append('image',file)
        if (Identifier) {
          formData.append('propId',Identifier)
        }
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        return post(urlUpload, formData,config)
      }
    }

    _selectImage(){
        document.getElementById("selectImage").click()
    }

    _handleRemove(id){
        let { files } = this.state;

        if (id.substring(0,4) !== 'FAKE') {
          this._handleRemoveApi(id).then((response)=>{
            if (response){
              let newFiles = reject(files, function(o) { return o.id === id; });
              this.setState({files: newFiles})
            }
          }).catch( error => {
            this._changeFileStatus(id , 4);
          });
        } else {
          let newFiles = reject(files, function(o) { return o.id === id; });
          this.setState({files: newFiles})
        }
    }

    _handleRemoveApi = (id) => {
        let { Identifier , urlDelete } = this.props;

        if (urlDelete){
          this._changeFileStatus(id , 1);

          // const rawData = {propId: Identifier ? Identifier : null , ImageId: id };

          const formData = new FormData();
          formData.append('propId',Identifier ? Identifier : null)
          formData.append('ImageId',id)

          // TODO: Need to be change to raw data -> check with mr.hoseinzadeh
          return axios.delete( urlDelete , { data: formData } );
        }
    }

    _changeFileStatus = (fileID , status) => {
        const NewFiles = this.state.files;
        let index = findIndex(NewFiles, function(o) { return o.id === fileID; });
        NewFiles[index].status = status;
        this.setState( { files : NewFiles });
    }

    _changeOrder = (newState) => {
        let { sortCounter } = this.state;
        let equality = isEqual(this.state.files, newState);
        if (!equality){
          if (sortCounter) {
            var results = filter(newState,function(obj) {
              return obj.id.substring(0,4) !== 'FAKE'
            });

            this.setState({files: newState} , () => {
              this.props.onSort(results);
            });
          } else {
            this.setState({sortCounter: sortCounter+1});
          }
          return false;
        }
    }

    render() {
        let { Identifier , header , title , subTitle , theme , editMode , onEdit , loading , images} = this.props;
        let {files} = this.state;

        const renderStatus = (status) => {
            switch(status) {
                case 1:
                    return <MDSpinner color1='white' color2='white' color3='grey' color4='grey'  size={25} borderSize={2}/>;
                case 2:
                    return <FaCheck className={[styles.iconSuccess ].join(" ")} />;
                case 3:
                    return <FaBan className={[styles.iconError ].join(" ")} />;
                default:
                    return <span/>;
            }
        };

        const renderThemeButton = (theme , type) => {
          switch(theme) {
            case 'blue':
              return type ? styles.uploaderBtnPrimaryBig : styles.uploaderBtnLink;
            case 'red':
              return type ? styles.uploaderBtnPrimaryBigRED : styles.uploaderBtnLinkRED;
            default:
              return type ? styles.uploaderBtnPrimaryBig : styles.uploaderBtnLink;
          }
        };

        return (
            <div>
                <form onSubmit={this._handleSubmit}>
                  <input className="fileInput"
                         ref={ref => this.fileInput = ref}
                         style={{ display: 'none' }}
                         id="selectImage"
                         type="file"
                         onChange={(e) => this._handleImageChange(e)}/>

                  <div className={[styles.displayInlineFlex].join(" ")}>
                    <h5>{header}</h5>&nbsp;&nbsp;&nbsp;

                    { loading &&
                      <div>
                        <MDSpinner size={15} borderSize={1}/> &nbsp;&nbsp;
                        <span className={styles.smallMutedText}>Loading</span>
                      </div>
                    }

                  </div>

                  <div>
                    {files && files.length ?
                      <div className={[styles.smallPhotoUploaderBox, styles.marginBottom20].join(" ")}>
                        <button onClick={this._selectImage.bind(this)} type="button" className={[styles.btn,
                          renderThemeButton(theme, 1)].join(" ")}>
                          <FaImage className='icon-class'/>
                          &nbsp; Add Photos
                        </button>
                      </div>
                      :
                      <div className={[styles.photoUploaderBox, styles.marginBottom20].join(" ")}>
                        <div>
                          <h4 style={{ marginTop: 80 }}>{title}</h4>
                          <h6>{subTitle}</h6>
                          <button onClick={this._selectImage.bind(this)} type="button"
                                  className={[styles.btn, renderThemeButton(theme, 1), styles.marginTop20].join(" ")}>
                            <FaImage className={[styles.iconClass].join(" ")}/>
                            &nbsp; Add Photos
                          </button>
                        </div>
                      </div>
                    }

                    <div className={[styles.imageUploaderPhotoList].join(" ")}>

                      {files && files.length ?

                        <ReactSortable
                          swapThreshold={1}
                          filter='.filtered'
                          animation={150}
                          list={files}
                          delayOnTouchStart={true}
                          delay={50}
                          setList={newState => this._changeOrder(newState)}>
                          {files.map((file, index) => (
                            <div key={index} className={[file.status === 1 ? styles.imageInLoad : '' , file.status === 3 && 'filtered' ,  styles.imageUploaderImagePreview ].join(" ")}>
                              <div className={[styles.centerizedBox ].join(" ")}>
                                { renderStatus(file.status) }
                              </div>

                              <img alt="pic" src={file.url}/>
                              <div className={[styles.imageButtonActionsPlace].join(" ")}>
                                {editMode ?
                                  <button onClick={(event) => onEdit({ event, Identifier, file })}
                                          className={[renderThemeButton(theme, 0)].join(" ")}><FaEdit/>&nbsp;Edit
                                  </button> : <span/>
                                }
                                <button className={[renderThemeButton(theme, 0)].join(" ")}
                                        onClick={this._handleRemove.bind(this, file.id)}><FaTrash/>&nbsp;Delete
                                </button>
                              </div>
                              {index + 1 === 1 &&
                              <div className={[styles.mainPhotoLabel].join(" ")}> Main Photo</div>
                              }

                              { file.hasOwnProperty('error') && file.error &&
                              <div className={[styles.imageBoxError].join(" ")}>
                                { file.error }
                              </div>
                              }
                            </div>
                          ))}
                        </ReactSortable> : <span/>

                      }
                      <div style={{ clear: 'both' }}/>
                    </div>
                  </div>
                </form>
            </div>
        );
    }

    static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if ( ( props.images && props.images.length ) && !state.files.length) {
      return {
        files: props.images
      };
    }
    return null;
  }
}

export default PhotoUploaderComponent;

PhotoUploaderComponent.defaultProps = {
    Identifier: null,
    header: 'Photo Gallery',
    title: 'Upload at least 1 photo',
    subTitle: 'You`ll also be able to upload more after registration',
    theme: 'blue',
    urlUpload: null,
    urlDelete: null,
    editMode: false,
    images: [],
    loading: false,
    onEdit: (editData) => console.log(editData , 'Edit event launched'),
    onSort: (sortedData) => console.log(sortedData , 'Sort event launched'),
};
