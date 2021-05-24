import './Contas.scss';

import React, { Component, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import BasicStyles from '@ckeditor/ckeditor5-basic-styles/build/basic-styles';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/';

export default function Contas(props) {

    const ckEditorRef = useRef(null)

    return <div className='module-wrapper'>
        'Modulo Contas'


        <div className='editor-container'>
            <CKEditor
                ref={ckEditorRef}
                editor={ClassicEditor}
                config={{
                    toolbar: ['heading', '|', 'bold', 'italic', 'alignment', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable',
                        '|', 'undo', 'redo']
                }}

                data="<p>Hello from CKEditor 5!</p>"
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(e, editor) => {
                    const data = editor.getData();
                    console.log({ e, editor, data });

                    console.log(ckEditorRef);
                }}
                onBlur={(e, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(e, editor) => {
                    console.log('Focus.', editor);
                }}
            />
        </div>
    </div>
}