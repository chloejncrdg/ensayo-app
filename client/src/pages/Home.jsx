import React from 'react';

const Home = () => {

  const objectives = [
    {
      icon: "/assets/home/clock.png", 
      title: "Self-paced learning in a safe environment",
      description: "Progress at your own pace while practicing in a virtual environment, allowing you to learn from mistakes without real-world consequences."
    },
    {
      icon: "/assets/home/brain.png",
      title: "Enhance retention with interactive learning",
      description: "Engage with immersive 3D experiences that reinforce key concepts, making it easier to retain information."
    },
    {
      icon: "/assets/home/cube.png",
      title: "Bridge the gap between theory and practice",
      description: "Our platform allows you to turn theoretical concepts into experiences that prepare you for real-world challenges."
    }
  ];

  return (
    <div className='bg-[#F8FBFF] overflow-x-hidden'>
      
      {/* Hero Section */}
      <div className="relative bg-custom-darkBlue h-[90vh] sm:h-[80vh] md:h-[80vh]">
  <img
    src="/assets/home/hero.jpg"
    alt="Hero"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-[#0C3E89] to-[#5E9ECC] opacity-80"></div>
  <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between text-white p-8 md:pl-20">
    <div className="flex-2 text-center md:text-left max-w-3xl px-4 sm:px-6 md:px-12 mb-6 md:mb-0 flex flex-col justify-center">
      <div className="mt-24 md:mt-6 text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-satoshi-medium leading-tight mb-4">
        Immersive approach to learning{" "}
        <span className="text-[#F1D368] border-b-4 border-[#F1D368] font-satoshi-bold">
          tech-voc skills
        </span>
      </div>
      <div className="mt-6 font-satoshi-medium w-full text-lg sm:text-xl md:text-2xl mb-6 text-[#e7f7ff]">
        Powered by 3D technology, our platform brings technical skills to life with models and realistic simulations.
      </div>
      <div className="flex justify-center md:justify-start mt-6">
        <button className="font-satoshi-bold w-56 bg-[#F1D369] text-[#0C3E89] font-bold text-lg sm:text-xl md:text-2xl px-6 py-3 rounded-lg shadow-lg hover:bg-[#F0C24C] transition">
          Join for free
        </button>
      </div>
    </div>
    <div className="w-32 h-auto sm:w-40 md:w-48 flex-none md:flex-grow md:ml-6">
      <img
        src="/assets/home/3dshapes.png"
        alt="3D Shapes"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</div>



      {/* Accreditation Section */}
        <div className='flex flex-col justify-center items-center text-center my-12'>
          <div className='font-satoshi-bold text-xl sm:text-2xl md:text-3xl font-bold text-[#57729c] mb-4'>Accredited by</div>
          <div className='bg-white shadow-lg w-[300px] sm:w-[350px] md:w-[400px] rounded-2xl py-4 flex justify-center'>
            <img alt='Tesda Logo' src='/assets/tesda/tesda-faded.png'/>
          </div>
        </div>

      {/* Objectives Section */}
      <div className="bg-gradient-to-b from-[#F8FBFF] to-[#CBD6E5] py-12 md:py-24">
        <div className="text-center mb-8">
          <h2 className="p-8 font-satoshi-medium text-3xl sm:text-4xl md:text-5xl font-bold text-custom-darkBlue leading-tight">
            We are an innovative tech-voc learning experience
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6 px-8 md:px-8">
          {objectives.map((objective, index) => (
            <div key={index} className="flex flex-col justify-center items-center gap-4 p-6 md:p-8 w-full sm:w-[48%] md:w-[30%] lg:w-[22%] bg-white text-[#003C95] shadow-lg rounded-lg hover:shadow-xl transition">
              <img alt='Icon' src={objective.icon} className="w-16 h-16 mb-4"/>
              <h3 className="font-satoshi-bold text-center text-xl md:text-2xl mb-2">{objective.title}</h3>
              <p className='font-satoshi-medium text-base md:text-lg font-medium text-center'>{objective.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className='py-12 md:py-24 bg-white'>
  <div className='container mx-auto px-4 md:px-6 lg:px-8 xl:px-24'>
    <div className='lg:w-[1000px] mx-auto flex flex-col gap-y-24 lg:justify-center lg:items-center'>
      {/* Interactive 3D Models Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
        <img
          src='/assets/home/ar.png'
          alt='Interactive 3D Models'
          className='w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl h-auto rounded-lg shadow-lg'
        />
        <div className='flex-1'>
          <div className='font-satoshi-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-custom-darkBlue mb-4'>
            Interactive 3D Models
          </div>
          <p className="px-6 font-satoshi-medium text-base md:text-lg lg:text-xl xl:text-2xl text-blue-900">
            Experience interactive learning with 3D models that you can rotate 360 degrees and view in augmented reality.
          </p>
        </div>
      </div>

      {/* Simulations Section */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-12 text-center md:text-left">
        <img
          src='/assets/home/sim-feature.png'
          alt='Simulations'
          className='w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl h-auto rounded-lg shadow-lg'
        />
        <div className='flex-1'>
          <div className='font-satoshi-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-custom-darkBlue mb-4'>
            Simulations powered by game engine
          </div>
          <p className="px-6 font-satoshi-medium text-base md:text-lg lg:text-xl xl:text-2xl text-blue-900">
            Experience immersive simulations powered by a game engine, offering realistic training scenarios.
          </p>
        </div>
      </div>
    </div>

    {/* Call-to-Action Button */}
    <div className='flex justify-center mt-12'>
      <button className='bg-[#2359AB] text-white font-bold text-lg sm:text-xl md:text-2xl px-6 py-3 rounded-lg shadow-lg hover:bg-[#1e4a9e] transition'>
        Try now!
      </button>
    </div>
  </div>
</div>



    </div>
  );
};

export default Home;
