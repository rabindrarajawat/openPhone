// // app/ClientAuthWrapper.tsx
// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       router.push("/");
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, [router]);

//   if (!isAuthenticated) {
//     return <div>Loading...</div>;
//   }

//   return <>{children}</>;
// }
