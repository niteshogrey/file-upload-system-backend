import './App.css'
import FileUploadComponent from './components/FileUploadComponent'
import ImageUploader from './components/Imageuploader'
import MultipleDocumentUpload from './components/MultipleDocumentUpload'

function App() {

  return (
   <div className='flex '>
   <ImageUploader />
   <FileUploadComponent/>
   </div>
  )
}

export default App
