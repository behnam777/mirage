import Link from 'next/link'
import C from '../user/c';

export default function D() {
    return <div className='myDiv' > 
      D Page
      <img src={__dirname+"../public/logo.jpg"}/>
      <C/>
        <Link href="../user/c" as={"/vi/user/c"}>
             <a>c</a>
        </Link>
    </div>
} 