import React from 'react';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';

const UploadMissingImg = (file) => {
    // 환경변수 설정
    const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
    const REGION = process.env.REACT_APP_REGION;
    const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
    const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
    
    // aws 환경설정
    AWS.config.update({ accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_ACCESS_KEY, region: REGION });
    const s3 = new AWS.S3();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]; // Extract base64 data
            const base64Data = Buffer.from(base64, 'base64');
            const type = file.type.split('/')[1];
            const params = {
                Bucket: S3_BUCKET,
                Key: `${uuidv4()}.${type}`,
                Body: base64Data,
                ACL: 'public-read',
                ContentEncoding: 'base64', // required
                ContentType: type // required
            };

            s3.upload(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data.Location); // 이미지 업로드 후 URL 반환

                    //getUrl(data.Location); //콜백함수에 넣기
                }
            });
        };
        reader.readAsDataURL(file);
    });
}

export default UploadMissingImg;