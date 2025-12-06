function Footer() {
  return (
    <footer className="mt-10 border-t">
      <div className="container py-6 flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          CookSnap &copy; {new Date().getFullYear()}
        </p>

        <div className="flex gap-4 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
