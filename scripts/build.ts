import path from 'path';
import fs from 'fs';

function copyVideos() {
  const videoPath = path.resolve(`${process.cwd()}/src/video`);
  const productionVideoPath = path.resolve(`${process.cwd()}/build/src/video`);

  if (!videoPath || !productionVideoPath) {
    throw new Error("Folder doesn't exists");    
  }

  const videoFiles = fs.readdirSync(videoPath);

  videoFiles.forEach((file) => {
    fs.copyFileSync(`${videoPath}/${file}`, `${productionVideoPath}/${file}`);

    if (fs.existsSync(`${productionVideoPath}/${file}`)) {
      console.log(`${file} has been copied`);
    }
  })
}

// Function to check whether the video folder exists or not
function checkVideoFolder(): void {
  const videoPath = path.resolve(`${process.cwd()}/src/video`);
  const productionVideoPath = path.resolve(`${process.cwd()}/build/src/video`);

  if (!fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath);
  } else {
    console.log("The video folder already exists");
  }

  fs.mkdirSync(productionVideoPath); // buat folder video didalam folder build
  
  copyVideos();
}

void checkVideoFolder();