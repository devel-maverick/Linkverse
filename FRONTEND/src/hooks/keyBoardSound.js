const keySound=[
    new Audio('/sounds/keystroke1.mp3'),
     new Audio('/sounds/keystroke2.mp3'),
      new Audio('/sounds/keystroke3.mp3'),
       new Audio('/sounds/keystroke4.mp3')
]
function keyBoardSound(){
    const playRandom=()=>{
        const randomSound=keySound[Math.floor(Math.random()*keySound.length)]
        randomSound.currentTime=0
        randomSound.play().catch((error)=>console.log("Audio play failed:",error))

    }
    return {playRandom}

}
export default keyBoardSound