import React, { Component } from 'react';
import MDSpinner from "react-md-spinner";
import { ReactSortable } from "react-sortablejs";
import reject from 'lodash/reject';
import { FaEdit , FaTrash , FaCheck , FaBan , FaImage } from "react-icons/fa";
import styles from './styles.module.css';

class PhotoUploaderComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: []
        };
    }

    _handleSubmit = (e) => {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        console.log('handle uploading-', this.state.file);
    }

    _handleImageChange(e) {
        let { files } = this.state;
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState( prevState => ({
                files: [...prevState.files,  {file: file, imagePreviewUrl: reader.result , order: prevState.files.length+1 , status: 3 }]
            }));
        };

        reader.readAsDataURL(file);
        this.fileInput.value = "";
    }

    _selectImage(){
        document.getElementById("selectImage").click()
    }

    _handleRemove(id){
        let { files } = this.state;
        let newFiles = reject(files, function(o) { return o.order === id; });

        this.setState({files: newFiles})
    }

    _changeOrder = (newState) => {
        this.setState({files: newState});
    }

    render() {
        let { Identifier , header , title , subTitle , theme , editMode , onEdit} = this.props;
        let {files} = this.state;

        const renderStatus = (status) => {
            switch(status) {
                case 1:
                    return <MDSpinner color1='white' color2='black' color3='white' color4='white'  size={25} borderSize={2}/>;
                case 2:
                    return <FaCheck className={[styles.iconSuccess ].join(" ")} />;
                default:
                    return <FaBan className={[styles.iconError ].join(" ")}/>;
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
                <form onSubmit={(e) => this._handleSubmit(e)}>
                        <input className="fileInput"
                               ref={ref=> this.fileInput = ref}
                               style={{display: 'none'}}
                               id="selectImage"
                               type="file"
                               onChange={(e)=>this._handleImageChange(e)} />

                        <h5>{header}</h5>

                        { files && files.length ?
                            <div className={[styles.smallPhotoUploaderBox , styles.marginBottom20].join(" ")}>
                                <button onClick={ this._selectImage.bind(this) } type="button" className={[styles.btn ,
                                  renderThemeButton(theme , 1)].join(" ")}>
                                    <FaImage className='icon-class'/>
                                    &nbsp; Add Photos </button>
                            </div>
                            :
                            <div className={[styles.photoUploaderBox , styles.marginBottom20].join(" ")}>
                                <div>
                                    <h4 style={{marginTop: 80}}>{title}</h4>
                                    <h6>{subTitle}</h6>
                                    <button onClick={ this._selectImage.bind(this) } type="button" className={[styles.btn ,  renderThemeButton(theme ,1), styles.marginTop20].join(" ")}>
                                        <FaImage className={[styles.iconClass].join(" ")}/>
                                        &nbsp; Add Photos </button>
                                </div>
                            </div>
                        }

                        <div className={[styles.imageUploaderPhotoList].join(" ")}>

                            {files && files.length ?

                                <ReactSortable
                                    swapThreshold={1}
                                    animation={150}
                                    list={files}
                                    setList={newState =>  this._changeOrder(newState)}>
                                    { files.map( (file , index) => (
                                        <div key={index} className={[styles.imageUploaderImagePreview].join(" ")}>
                                            <div className={[styles.centerizedBox].join(" ")}>
                                                {renderStatus(file.status)}
                                            </div>


                                            <img alt="pic" src={file.imagePreviewUrl} />
                                            <div className={[styles.imageButtonActionsPlace].join(" ")}>
                                              { editMode ?
                                                <button onClick={(event) => onEdit({event , Identifier , file})} className={[renderThemeButton(theme , 0)].join(" ")}><FaEdit/>&nbsp;Edit</button> : <span/>
                                              }
                                                <button className={[renderThemeButton(theme , 0)].join(" ")} onClick={this._handleRemove.bind(this , file.order )}><FaTrash/>&nbsp;Delete</button>
                                            </div>
                                            { index+1 === 1 &&
                                            <div className={[styles.mainPhotoLabel].join(" ")}> Main Photo</div>
                                            }
                                        </div>
                                    ))}
                                </ReactSortable> : <span/>

                            }
                            <div style={{clear: 'both'}}/>
                        </div>
                    </form>
            </div>
        );
    }

}

export default PhotoUploaderComponent;

PhotoUploaderComponent.defaultProps = {
    Identifier: null,
    header: 'Photo Gallery',
    title: 'Upload at least 1 photo',
    subTitle: 'You`ll also be able to upload more after registration',
    theme: 'blue',
    urlUpload: 'https://test.com/image/upload',
    urlDelete: 'https://test.com/image/remove',
    editMode: false,
    onEdit: (editData) => console.log(editData , 'Edit event launched'),
    onSort: (sortedData) => console.log(sortedData , 'Sort event launched'),
};
