import { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className='updater-node'>
      <div className='node'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='5'
          height='40'
          viewBox='0 0 5 40'
          fill='none'
        >
          <path
            d='M0 5C0 2.23858 2.23858 0 5 0V40C2.23858 40 0 37.7614 0 35V5Z'
            fill='#2A86FF'
          />
        </svg>
        <div className='content'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='13'
            height='15'
            viewBox='0 0 13 15'
            fill='none'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M6.77212 0.983723C5.36604 -0.141133 3.71543 -0.106076 2.53708 0.142002C1.8186 0.293259 1.08848 0.540503 0.447519 0.906114C0.17078 1.06425 0 1.35854 0 1.67728V14.1118C0 14.6024 0.397657 15 0.888182 15C1.37871 15 1.77636 14.6024 1.77636 14.1118V9.34175C2.99865 8.82651 4.55105 8.58724 5.66243 9.47631C7.06851 10.6011 8.71911 10.5661 9.89746 10.318C10.7967 10.1287 11.4967 9.806 11.8087 9.64844C12.1565 9.47293 12.4345 9.20319 12.4345 8.78273V1.67728C12.4345 1.36066 12.266 1.06799 11.9921 0.909071C11.7185 0.750264 11.3815 0.748781 11.1067 0.905563L11.1059 0.905989C9.82871 1.60385 7.99479 1.96189 6.77212 0.983723ZM1.77636 2.23627V7.44956C3.44735 6.9147 5.34774 6.9497 6.77212 8.08914C7.5865 8.74072 8.60044 8.7758 9.53153 8.57978C9.97748 8.48581 10.3712 8.34467 10.6582 8.2237V3.01047C10.4264 3.08468 10.1707 3.15503 9.89746 3.21254C8.71911 3.46062 7.06851 3.49568 5.66243 2.37082C4.55105 1.48174 2.99865 1.72107 1.77636 2.23627Z'
              fill='#2A86FF'
            />
          </svg>
          <p>Starting Point</p>
        </div>
      </div>

      <Handle
        type='source'
        position={Position.Right}
        id='b'
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
