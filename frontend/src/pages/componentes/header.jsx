import { Link } from "react-router-dom";

const Header = () => {
    return ( 
<header class="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-b border-[#f0f4f4] dark:border-gray-800 transition-colors duration-300">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center justify-between h-16">
<div class="flex items-center gap-2 group">
<div class="rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
</div>
<img class="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors" src="img/logo.jpg" alt="Logo Estágio Fortaleza" ClassName="h-8 w-auto"/>
<h1 class="text-[#111718] dark:text-white text-xl font-bold tracking-tight">Estágio Fortaleza</h1>
</div>
<div class="flex items-center gap-4">
<a href="restrito/login.php" class="flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-primary/80 text-white text-sm font-bold shadow-lg shadow-teal-500/20 transition-all transform active:scale-95">
                        Entrar
</a>
</div>
</div>
</div>
</header>
     );
}
export default Header;