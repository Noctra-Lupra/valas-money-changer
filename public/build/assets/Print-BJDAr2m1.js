import{r as n,j as t,H as s}from"./app-CeA5vgJp.js";import{I as o}from"./InvoiceTemplate-K9YP5BAO.js";function u({transaction:e,items:i=[],notaLayouts:m,invoiceTemplate:r}){return n.useEffect(()=>{const a=setTimeout(()=>window.print(),300);return()=>clearTimeout(a)},[]),t.jsxs("div",{className:"min-h-screen w-full bg-white p-4 print:p-0",children:[t.jsx(s,{title:`Print Nota - ${e.invoice_number}`}),t.jsx("div",{className:"mx-auto w-full max-w-[900px] print:w-full print:max-w-none",children:t.jsx(o,{transaction:e,templateId:e.template_id??1,items:i,invoiceTemplate:r})}),t.jsx("style",{children:`
                @page {
                    size: auto;
                    margin: 10mm;
                }

                @media print {
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    .print\\:p-0 {
                        padding: 0 !important;
                    }
                }
            `})]})}export{u as default};
