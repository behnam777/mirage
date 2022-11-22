import Link from 'next/link'

export default function D() {
    return <div className='myDiv' > 
      D Page
      <img src={__dirname+"../public/logo.jpg"}/>
        <Link href="../user/c" as={"../user/c"}>
             <a>c</a>
        </Link>
    </div>
} 