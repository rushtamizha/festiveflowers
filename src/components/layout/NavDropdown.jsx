'use client';

import { useState } from 'react';

// The dropdown opens with CSS (hover / keyboard focus), so it works before JavaScript loads.
// This wrapper only closes it again after a link inside has been clicked.
export default function NavDropdown({ trigger, children }) {
  const [closed, setClosed] = useState(false);

  return (
    <li
      className="group/menu relative"
      onMouseLeave={() => setClosed(false)}
      onClickCapture={(e) => {
        if (e.target.closest('a')) {
          setClosed(true);
          document.activeElement?.blur?.();
        }
      }}
    >
      {trigger}
      <div
        className={`${closed ? 'hidden' : ''} invisible absolute top-full left-0 z-50 origin-top translate-y-2 scale-[0.98] pt-3 opacity-0 transition-[opacity,transform,visibility] duration-300 ease-fluid group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:scale-100 group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:scale-100 group-hover/menu:opacity-100`}
      >
        {children}
      </div>
    </li>
  );
}
