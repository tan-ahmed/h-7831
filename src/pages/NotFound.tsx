
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="mb-8">
          <motion.div 
            className="text-9xl font-bold text-primary"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2
            }}
          >
            404
          </motion.div>
          <h1 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Button 
          className="flex items-center gap-2" 
          onClick={() => navigate('/')}
        >
          <Home className="size-4" />
          Return to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
