// import React, { useState } from 'react';
// import { QrReader } from 'react-qr-reader';

// import classes from './Scanner.module.css';
// const Scanner = (props) => {
//   const [scan, setScan] = useState(false);

// const startReader = () => {
//   if (scan) setScan(false);
//   if (!scan) setScan(true);
// };

//   return (
//     <div className={classes.camera}>
//       <div className={classes.action}>
//         <button type="button" onClick={startReader}>
//           {scan ? 'Close Camera' : 'Open Camera'}
//         </button>
//       </div>
//       <div className={classes.camera}>
//         {scan && (
//           <QrReader
//             onResult={(result, error) => {
//               if (!!result) {
//                 props.scan(result?.text);
//               }

//               if (!!error) {
//                 console.info(error);
//               }
//             }}
//             style={{ width: '100%' }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Scanner;

import { useState, Fragment } from 'react';
import classes from './Scanner.module.css';
import QRScan from 'qrscan';

const Scanner = (props) => {
  const [camera, setCamera] = useState(false);

  const startReader = () => {
    if (camera) setCamera(false);
    if (!camera) setCamera(true);
  };

  return (
    <div className={classes.camera}>
      <div className={classes.action}>
        <button type="button" onClick={startReader}>
          {camera ? 'Close Camera' : 'Open Camera'}
        </button>
      </div>
      <div className={classes.camera}>
        {camera && (
          <QRScan
            onFind={(result, error) => {
              if (!!result) {
                props.scan(result);
              }

              if (!!error) {
                console.info(error);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Scanner;
