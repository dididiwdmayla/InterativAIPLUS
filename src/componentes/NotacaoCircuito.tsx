'use client';
import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
export function NotacaoCircuito({ texto }: { texto: string }) {
  const recipiente = useRef<HTMLDivElement>(null), editor = useRef<EditorView | null>(null);
  useEffect(() => {
    if (!recipiente.current) return;
    const view = new EditorView({ parent: recipiente.current, extensions: [
      EditorState.readOnly.of(true), EditorView.editable.of(false), lineNumbers(),
      EditorView.contentAttributes.of({ tabindex: '0', role: 'textbox', 'aria-label': 'Notação do circuito, somente leitura', 'aria-readonly': 'true', 'aria-multiline': 'true' }),
      EditorView.theme({
        '&': { backgroundColor: 'var(--cor-codigo-fundo)', color: 'var(--cor-codigo-texto)', fontSize: '.75rem' },
        '.cm-scroller': { fontFamily: 'var(--fonte-codigo)', overflow: 'auto', maxHeight: '280px' },
        '.cm-gutters': { backgroundColor: 'var(--cor-painel)', color: 'var(--cor-texto-suave)', borderColor: 'var(--cor-borda)' },
        '.cm-content': { padding: '12px 0' }, '.cm-line': { padding: '0 12px' },
        '&.cm-focused': { outline: '2px solid var(--cor-realce-inspecao)' },
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: 'var(--cor-selecao)' },
      }),
    ] });
    editor.current = view;
    return () => { view.destroy(); editor.current = null; };
  }, []);
  useEffect(() => { const view = editor.current; if (view && view.state.doc.toString() !== texto) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: texto } }); }, [texto]);
  return <div ref={recipiente} className="notacao-circuito"/>;
}
