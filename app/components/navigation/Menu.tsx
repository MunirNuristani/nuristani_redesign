import React from 'react'


const Menu = () => {

  const options:{label:string,link:string}[] = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "Alphabet",
      link: "/Alphabet",
    },
    {
      label: "Dictionary",
      link: "/dictionary",
    },
    {
      label: "Articles",
      link: "/Articles",
    },
    {
      label: "Books",
      link: "/Books",
    },
    {
      label: "LandScapes Pictures",
      link: "/LandScapes",
    },
    {
      label: "Historic Pictures",
      link: "/Historic",
    },
    {
      label: "Technology",
      link: "/Technology",
    },
    {
      label: "Contact Us",
      link: "/Contact",
    }

  ];




  return (
    <div>
      {
        options.map((option) => {
          return (
            <div key={option.label} className='w-full flex-grow-0 flex items-center justify-start overflow-x-hidden'>
              <a href={option.link} className="text-2xl font-bold cursor-pointer z-50">
                {option.label}
              </a>
            </div>
          )
        })
      }
    </div>
  )
}

export default Menu