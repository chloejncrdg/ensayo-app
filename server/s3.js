import aws from 'aws-sdk'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { promisify } from 'util'

dotenv.config()
const region = "ap-southeast-1"
const bucketName = "introbirds-image-upload"
const objectBucketName = "introbirds-object-upload"
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_KEY_ID

const randomBytes = promisify(crypto.randomBytes)

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

export async function generateUploadImageURL() {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL

}

export async function generateUploadObjectURL(extension) {
    const rawBytes = await randomBytes(16)
    const objectName = `${rawBytes.toString('hex')}.${extension}`

    const params = ({
        Bucket: objectBucketName,
        Key: objectName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}