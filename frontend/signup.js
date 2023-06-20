
const webCamElement = document.getElementById('webcam')
const enableWebCam = document.getElementById('start-camera')
const takeImages = document.getElementById('take-images')

const sendClassifier = document.getElementById('sendClassifier')
const inputClassifier = document.getElementById('inputClassifier')

const statusMessage = document.getElementById('status')

const userName = document.getElementById('name')

sendClassifier.addEventListener('click', () => {
    inputClassifier.disabled = false
})

enableWebCam.addEventListener('click', startCamera)
const hasCamera = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

function startCamera() {
    if(hasCamera()){
        const props = {
            video: true, 
            width: 320,
            height: 240
        }
    
        navigator.mediaDevices.getUserMedia(props).then( (stream) => {
            webCamElement.srcObject = stream
            webCamElement.addEventListener('loadeddata', () => {
                videoPlaying = true
                enableWebCam.classList.add('removed')
            })
        })

    }
    else{
        alert('getUserMedia() is not supported by your browser')
    }

}

const usersImages = []

const userAttributes = []
const generatedFacesAttributes = []


let model

async function loadModel(){
    model = await blazeface.load();

}

async function takeImagesFromWebcam(){

    const canvasImage = document.createElement('canvas')

    canvasImage.width = webCamElement.width
    canvasImage.height = webCamElement.height

    const context = canvasImage.getContext('2d')

    await loadModel()

    async function takeImage(index){ 
        if(index < 50){
            const prediction = await model.estimateFaces(webCamElement,false)

            const leftEye = { 
                'x' : prediction[0].landmarks[0][0],
                'y' :  prediction[0].landmarks[0][1]
            }

            const rightEye = {
                'x' : prediction[0].landmarks[1][0],
                'y' : prediction[0].landmarks[1][1]
            }

            const leftEar = {
                'x' : prediction[0].landmarks[2][0],
                'y' : prediction[0].landmarks[2][1]
            }

            const rightEar = {
                'x' : prediction[0].landmarks[3][0],
                'y' : prediction[0].landmarks[3][1]
            }

            const nose = {
                'x' : prediction[0].landmarks[4][0],
                'y' : prediction[0].landmarks[4][1]
            }

            const mouth = {
                'x' : prediction[0].landmarks[5][0],
                'y' : prediction[0].landmarks[5][1]
            }

            const res = getAttribute(leftEye,rightEye, leftEar, rightEar, nose, mouth)
            userAttributes.push(res)

            // item.landmarks = [
            // prediction[0].landmarks[0][0], prediction[0].landmarks[0][1],
            // prediction[0].landmarks[1][0],prediction[0].landmarks[1][1],
            // prediction[0].landmarks[2][0], prediction[0].landmarks[2][1],
            // prediction[0].landmarks[3][0],prediction[0].landmarks[3][1],
            // prediction[0].landmarks[4][0], prediction[0].landmarks[4][1],
            // prediction[0].landmarks[5][0], prediction[0].landmarks[5][1]]
            // item.class = 1

            // usersLandmarks.push(item)
            //console.log(usersLandmarks)

            setTimeout(() => {

                let topX = prediction[0].topLeft[0]
                let topY = prediction[0].topLeft[1]
                let rightX = prediction[0].bottomRight[0]
                let rightY = prediction[0].bottomRight[1]

                 const canvasCropped = document.createElement('canvas')
                 canvasCropped.width = 320
                 canvasCropped.height = 240
                if(prediction.length === 0) console.log('Image number ', i, ' has no face!')
                 else{
                canvasCropped.getContext('2d').drawImage(webCamElement,
                topX,topY,
                rightX - topX , rightY - topY ,
                0,0,
                320, 240)

            const dataUrl = canvasCropped.toDataURL('image/jpeg')
            usersImages.push(dataUrl)
            statusMessage.textContent = `Photo number ${index + 1} taken!`
            //console.log('photo ', index);
        }
                takeImage(index + 1)
        },100)
        } else {
            console.log("All images captured", usersImages.length);
            //console.log(userAttributes);
            //console.log(labelsGenerated());
            
            let attributes = [...userAttributes, ...generatedFacesAttributes]
            let labels = [...labelsUsers(), ...labelsGenerated()]
            //console.log(attributes)
            //console.log(labels);
            //const labels = [...labelsUsers(),...labelsGenerated()]
            const classifier = "Classifier:    101.81117 * x[0] + 69.16066 * x[1] + 73.35614 * x[2] + 47.42073 * x[3] + 122.393524 * x[4] + 30.586582 * x[5] + 32.870285 * x[6] + 148.91354 * x[7] + 3.5145197 * x[8] - 8.172945 * x[9] + 115.35281 * x[10] + 56.868523 * x[11] + 119.242966 * x[12] + 50.326527 * x[13] + 169.70547 * x[14] - 119020.72 < 0 ? 0 : 1"
            console.log(getWeights(classifier));
            convertToCSV(attributes,labels)
            //SMO(attributes, labels)
            //convertToCSV(userAttributes, labelsUsers())
            
            // const {weights, bias} = SMO([...userAttributes, ...generatedFacesAttributes], 
            //     [...labelsUsers(),...labelsGenerated()])
        //   const classifier = SMO(attributes, labels)
        //   const test = [97, 66.05, 67.09,59.2,134.9,32,155,38.4,6.2,124.8,66.2,125.8,67.02,193.8]
        //   const prediction = classifier.predict(test)
        //   console.log(prediction);
        //   console.log(classifier);
        }
    }

    takeImage(0)
    loadGeneratedFaces(1)
    
}

async function testClassifier(){
    const attributes = [...userAttributes, ...generatedFacesAttributes]
    const labels = [...labelsUsers(),...labelsGenerated()]
    const classifier = SMO2(attributes, labels)
    const canvasImage = document.createElement('canvas')

    canvasImage.width = webCamElement.width
    canvasImage.height = webCamElement.height

    const context = canvasImage.getContext('2d')

    const prediction = await model.estimateFaces(webCamElement,false)
    
    const leftEye = { 
        'x' : prediction[0].landmarks[0][0],
        'y' :  prediction[0].landmarks[0][1]
    }

    const rightEye = {
        'x' : prediction[0].landmarks[1][0],
        'y' : prediction[0].landmarks[1][1]
    }

    const leftEar = {
        'x' : prediction[0].landmarks[2][0],
        'y' : prediction[0].landmarks[2][1]
    }

    const rightEar = {
        'x' : prediction[0].landmarks[3][0],
        'y' : prediction[0].landmarks[3][1]
    }

    const nose = {
        'x' : prediction[0].landmarks[4][0],
        'y' : prediction[0].landmarks[4][1]
    }

    const mouth = {
        'x' : prediction[0].landmarks[5][0],
        'y' : prediction[0].landmarks[5][1]
    }

    const res = getAttribute(leftEye,rightEye, leftEar, rightEar, nose, mouth)
    console.log(classifier.predict(res))
    


}

const mean = (data) => {
    let sum = 0
    for( let i = 0; i<data.length; i++){
        sum += data[i]
    }
    return sum
}
async function loadGeneratedFaces(index){
    while(index < 21){

        const image = document.getElementById(`person-${index}`)
        index++
        const prediction = await model.estimateFaces(image,false)

        const leftEye = { 
            'x' : prediction[0].landmarks[0][0],
            'y' :  prediction[0].landmarks[0][1]
        }

        const rightEye = {
            'x' : prediction[0].landmarks[1][0],
            'y' : prediction[0].landmarks[1][1]
        }

        const leftEar = {
            'x' : prediction[0].landmarks[2][0],
            'y' : prediction[0].landmarks[2][1]
        }

        const rightEar = {
            'x' : prediction[0].landmarks[3][0],
            'y' : prediction[0].landmarks[3][1]
        }

        const nose = {
            'x' : prediction[0].landmarks[4][0],
            'y' : prediction[0].landmarks[4][1]
        }

        const mouth = {
            'x' : prediction[0].landmarks[5][0],
            'y' : prediction[0].landmarks[5][1]
        }

        const res = getAttribute(leftEye,rightEye, leftEar, rightEar, nose, mouth)
        generatedFacesAttributes.push(res)
        
    }
        
 }
    


function getDistance(A , B){
    return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y))
}
function getAttribute (leftEye, rightEye, leftEar, rightEar, nose, mouth) {

    const res=[]

    const leftEyeRightEye = getDistance(leftEye,rightEye)
    const leftEyeLefEar = getDistance(leftEye, leftEar)
    const leftEyeRighEar = getDistance(leftEye, rightEar)
    const leftEyeNose = getDistance(leftEye, nose)
    const leftEyeMouth = getDistance(leftEye, mouth)

    const rightEyeRightEar = getDistance(rightEye, rightEar)
    const rightEyeLeftEar = getDistance(rightEye, leftEar)
    const rightEyeNose = getDistance(rightEye, nose)
    const rightEyeMouth = getDistance(rightEye, mouth)

    const leftEarRightEar = getDistance(leftEar, rightEar)
    const leftEarNose = getDistance(leftEar, nose)
    const leftEarMouth = getDistance(leftEar, mouth)

    const rightEarNose = getDistance(rightEar, nose)
    const rightEarMouth = getDistance(rightEar, mouth)

    const noseMouth = getDistance(nose, mouth)

    res.push(leftEyeRightEye, leftEyeLefEar, leftEyeRighEar, leftEyeNose, leftEyeMouth,
        rightEyeRightEar, rightEyeLeftEar, rightEyeNose, rightEyeMouth,
        leftEarRightEar,leftEarNose, leftEarMouth,
        rightEarNose, rightEarMouth,
        noseMouth)

    return res

}

const labelsUsers = () => {
    const length = userAttributes.length
    return new Array(length).fill(1)
}

const labelsGenerated = () => {
    const length = generatedFacesAttributes.length
    return new Array(length).fill(0)
}

function SMO(attributes, labels){

    const N = parseInt (attributes.length  * 0.8 )// length of learning vectors
    const dim = attributes[0].length

    function KernelGaussian(x, y){

        const sigma = 100
        let squaredDistance = 0

        for(let i = 0; i < x.length; i++){
            const diff = Math.abs( x[i] - y[i] )
            squaredDistance += diff * diff
        }
        squaredDistance *= -1
        const exponent = squaredDistance / (2 * sigma * sigma)

        return Math.exp(exponent)
    }

    // function KernelGaussian(x, y){
    //     let s = 0
    //     for(let i = 0; i < x.length; i++) s += x[i] * y[i] 
    //     console.log(s)
    //     return s
    // }

    function getRandomIndex(min, max){
        let res = Math.random() * ( max - min + 1)
        return Math.floor(res) + min
    }

    function getLabel(x){
        if (x == 0)
            return -1
        else return 1
    }

    const C = 1000
    const tolerance = 0.01
    const maxPasses = 100
    let passes = 0

    let alphas = []
    let bias = 0

    let k = 0, j = 0 
   
    let numChangedAlphas = 0
    let yChangedI = 0, yChangedJ = 0, yChangedK = 0
    let oldAlphaI = 0, oldAlphaJ = 0
    let EI = 0, EJ = 0, L = 0, H = 0, eta = 0
    let b1 = 0, b2 = 0

    let w2 = [], w3 = [], wm2 = [], wp2 = []

    for(let i = 0; i < N; i++) alphas[i] = 0

    while(passes < maxPasses){
        passes += 1
        numChangedAlphas = 0

        for(let i = 0; i < N ; i++){
            EI = 0
            yChangedI = getLabel( labels[i])

            for(k = 0; k < N; k++){
                yChangedK =  getLabel( labels[k])
                EI += alphas[k] * yChangedK * KernelGaussian(attributes[k] , attributes[i])
            } 

            EI = EI + bias - yChangedI
           

            if((yChangedI * EI < -tolerance && alphas[i] < C) || (yChangedI * EI > tolerance && alphas[i] > 0)){ // always false? why true nice
                do{
                    j = getRandomIndex(1, N)
                }while(j == i)
                yChangedJ =  getLabel( labels[j]) 

                EJ = 0

                for(k = 0; k < N; k++){
                    yChangedK =  getLabel( labels[k])
                    EJ += alphas[k] * yChangedK * KernelGaussian(attributes[k], attributes[j])

                }

                EJ = EJ + bias - yChangedI
                console.log(EJ);
                oldAlphaI = alphas[i]
                oldAlphaJ = alphas[j]

                if(yChangedI != yChangedJ){
                    L = Math.max(0, alphas[j] - alphas[i])
                    H = Math.min(C, C + alphas[j] - alphas[i])

                } else if (yChangedI == yChangedJ){
                    L = Math.max(0, alphas[i] + alphas[j] - C)
                    H = Math.min(C, alphas[i] + alphas[j])
                }

                if(L == H) continue

                eta = 2 * KernelGaussian(attributes[i], attributes[j]) - KernelGaussian(attributes[i], attributes[i]) - KernelGaussian(attributes[j], attributes[j])
                
                if(eta >=0 ) continue

                alphas[j] = alphas[j] + yChangedJ * (EJ - EI) / eta
                console.log(alphas[j]);
                if(alphas[j] > H) alphas[j] = H
                else if(alphas[j] < L) alphas[j] = L

                if(Math.abs(alphas[j] - oldAlphaJ) < 1e-20) continue //check for 20 or 25 on e

                alphas[i] = alphas[i] - yChangedI * yChangedJ * (alphas[j] - oldAlphaJ)

                b1 = bias - EI - yChangedI * (alphas[i] - oldAlphaI) * KernelGaussian(attributes[i], attributes[i]) - yChangedJ * (alphas[j] - oldAlphaJ) * KernelGaussian(attributes[j], attributes[i])
                b2 = bias - EJ - yChangedI * (alphas[i] - oldAlphaI) * KernelGaussian(attributes[i], attributes[j]) - yChangedJ * (alphas[j] - oldAlphaJ) * KernelGaussian(attributes[j], attributes[j])

                if(0 < alphas[i] && alphas[i] < C) bias = b1
                else if(0 < alphas[j] && alphas[j] < C) bias = b2
                else bias = (b1 + b2) / 2

                numChangedAlphas += 1
                
            } 
        }

        if(numChangedAlphas == 0) passes += 1
        else passes = 0

    }
    console.log("stop");
    const vectorsSupport = []
    for(let i = 0; i < N; i++){
        if(isNaN(alphas[i])) continue
        if(alphas[i] != 0)
        vectorsSupport.push(i)
    }

    console.log(alphas)
    console.log(vectorsSupport)

}

function convertToCSV(attributes, labels){
    const lineArray = [];
    const vectorsCount = attributes.length
    const attributesCount = attributes[0].length
    lineArray.push("%............comments............")
    lineArray.push("%............comments............")
    lineArray.push("%............comments............")
    lineArray.push("%............comments............")
    lineArray.push("%............comments............")
    lineArray.push("%")
    lineArray.push("% attributes count = " + attributesCount)
    lineArray.push("% vectors count = " + vectorsCount )
    lineArray.push("%")
    lineArray.push("% Edit the attribute names (attrib_1, attrib_2, ...) in this text box and then save.")
    lineArray.push("%")
    lineArray.push("@relation xxxxxxxxxxx")
    for(let i =0;i<attributesCount;i++){
        lineArray.push("@attribute attrib_" + i + " numeric")
    }
    lineArray.push("@attribute class {0, 1}")
    lineArray.push("@data")

    for(let i = 0; i<vectorsCount; i++){
        let line=""
        for(let j = 0; j< attributesCount; j++){
            line += attributes[i][j] + ","
        }
        line += labels[i]
        
        lineArray.push(line)
    }

const csvContent = lineArray.join("\n");
const blob = new Blob([csvContent], {type: 'text/csv'})

const link = document.createElement('a')
link.href = URL.createObjectURL(blob)
link.download = userName.value

link.click()
URL.revokeObjectURL(link.href)
console.log(csvContent);
}

function getWeights(data){
    const regex =/-?\d+(\.\d+)?(?=\s*\*)/g

    const matches = data.match(regex)

    if(matches) return matches.map(Number)

    return []
}
  