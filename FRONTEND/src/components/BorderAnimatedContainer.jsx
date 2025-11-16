function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full [background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.cyan.500)_86%,_theme(colors.cyan.300)_90%,_theme(colors.cyan.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border  flex overflow-hidden">
      {children}
    </div>
  );
}
// export default BorderAnimatedContainer;
// function BorderAnimatedContainer({ children }) {
//   return (
//     <div
//       className="
//         w-full h-full 
//         [background:
//           linear-gradient(45deg,#172033,theme(colors.slate.900)_50%,#172033)_padding-box,
//           conic-gradient(
//             from_var(--border-angle),
//             theme(colors.red.400)_10%,
//             theme(colors.red.500)_30%,
//             theme(colors.red.600)_55%,
//             theme(colors.red.500)_75%,
//             theme(colors.red.400)_100%
//           )_border-box
//         ]
//         rounded-2xl 
//         border-[3px] border-transparent 
//         animate-border 
//         flex overflow-hidden
//         shadow-[0_0_25px_5px_rgba(255,0,0,0.35)]
//       "
//     >
//       {children}
//     </div>
//   );
// }

export default BorderAnimatedContainer;

