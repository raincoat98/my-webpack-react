import React, { useCallback, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',                     label: 'Home',       exact: true  },
  { path: '/about',                label: 'About',      exact: false },
  { path: '/stepper',              label: 'Stepper',    exact: false },
  { path: '/products',             label: 'CSR',        exact: true  },
  { path: '/products-server',      label: 'SSR',        exact: false },
  { path: '/resource-transfer',    label: '자원 이관',  exact: false },
  { path: '/service-registration', label: '서버 등록',  exact: false },
  { path: '/aggrid-enterprise',    label: 'Enterprise', exact: false },
  { path: '/aggrid-column-size',   label: '컬럼 전략',  exact: false },
];

const MAX_SCALE = 1.8;
const SPREAD    = 80;

function calcScale(mouseY, itemCenterY) {
  const dist = Math.abs(mouseY - itemCenterY);
  if (dist > SPREAD) return 1;
  return 1 + (MAX_SCALE - 1) * Math.cos((dist / SPREAD) * (Math.PI / 2));
}

export default function RightDock() {
  const [open, setOpen]     = useState(true);
  const [scales, setScales] = useState(function() { return NAV_ITEMS.map(function() { return 1; }); });
  const itemRefs            = useRef([]);

  const handleMouseMove = useCallback(function(e) {
    var mouseY = e.clientY;
    setScales(itemRefs.current.map(function(el) {
      if (!el) return 1;
      var rect = el.getBoundingClientRect();
      return calcScale(mouseY, rect.top + rect.height / 2);
    }));
  }, []);

  const handleMouseLeave = useCallback(function() {
    setScales(NAV_ITEMS.map(function() { return 1; }));
  }, []);

  if (!open) {
    return (
      <div style={styles.closedWrapper}>
        <button onClick={function() { setOpen(true); }} style={styles.toggleBtn}>
          ◀
        </button>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.dock}>
        <button onClick={function() { setOpen(false); }} style={styles.closeBtn}>
          ▶
        </button>
        <div style={styles.divider} />
        <div
          style={styles.itemList}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {NAV_ITEMS.map(function(item, i) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                exact={item.exact}
                style={styles.link}
                activeStyle={styles.linkActive}
              >
                <div
                  ref={function(el) { itemRefs.current[i] = el; }}
                  style={Object.assign({}, styles.item, { transform: 'scale(' + scales[i] + ')' })}
                  title={item.label}
                >
                  <span style={styles.label}>{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

var styles = {
  /* 사이드바 컨테이너 — sticky로 스크롤해도 따라옴 */
  wrapper: {
    width: 72,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    position: 'sticky',
    top: '50vh',
    transform: 'translateY(-50%)',
    padding: '8px 0',
  },
  closedWrapper: {
    width: 20,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    position: 'sticky',
    top: '50vh',
    transform: 'translateY(-50%)',
  },
  dock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(28,28,36,0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 18,
    padding: '10px 6px 12px',
    boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
    width: '100%',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    cursor: 'pointer',
    width: 28,
    height: 24,
    borderRadius: 6,
    marginBottom: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtn: {
    background: 'rgba(28,28,36,0.82)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    cursor: 'pointer',
    width: 18,
    height: 40,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 36,
    height: 1,
    background: 'rgba(255,255,255,0.1)',
    marginBottom: 6,
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  link: {
    display: 'block',
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.55)',
    width: '100%',
  },
  linkActive: {
    color: '#63b3ed',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '7px 4px',
    borderRadius: 10,
    cursor: 'pointer',
    transformOrigin: 'center center',
    transition: 'transform 0.12s cubic-bezier(0.34,1.56,0.64,1)',
    willChange: 'transform',
    width: '100%',
  },
  label: {
    fontSize: 10,
    whiteSpace: 'nowrap',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
};
