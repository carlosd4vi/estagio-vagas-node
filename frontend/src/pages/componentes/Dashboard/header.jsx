import { Link } from "react-router-dom";
import Logo from "../../../assets/img/logo.jpg";

const Header = () => {
    return ( 
<header class="sticky top-0 z-50 w-full bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
<div class="flex items-center gap-3">
<Link to="/">       
<div class="flex items-center justify-center size-8 rounded-lg bg-primary text-white">
<img src={Logo} title="Estágio Fortaleza" />
</div>
</Link>
<h1 class="text-lg font-bold tracking-tight text-text-main dark:text-white">Estágio Fortaleza</h1>
</div>
<div class="flex items-center gap-4">
<div class="hidden sm:block text-right">
<p class="text-sm font-semibold text-text-main dark:text-white">Bem-vindo!</p>
</div>
</div>
</div>
</header>
     );
}
 
export default Header;