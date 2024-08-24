import { db } from './firebase.js';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

// Referencias a las colecciones en Firestore
const respuestasAlumnoRef = collection(db, 'respuestasAlumno');
const preguntasProfesorRef = collection(db, 'preguntasProfesor');

// Función para guardar la respuesta del alumno
async function guardarRespuestaEnFirebase(respuesta, alDia) {
    try {
        const docRef = await addDoc(respuestasAlumnoRef, {
            respuesta,
            alDia,
            timestamp: new Date()
        });
        console.log('Respuesta guardada en Firestore con ID:', docRef.id);
    } catch (e) {
        console.error('Error al guardar la respuesta en Firestore: ', e);
    }
}

// Función para guardar la pregunta del profesor
async function guardarPreguntaProfesor(pregunta) {
    try {
        await addDoc(preguntasProfesorRef, {
            pregunta,
            timestamp: new Date()
        });
        console.log('Pregunta guardada en Firestore');
    } catch (e) {
        console.error('Error al guardar la pregunta en Firestore: ', e);
    }
}

// Función para mostrar la pregunta del profesor
function mostrarPreguntaProfesor() {
    const preguntaProfesorElement = document.getElementById('preguntaProfesor');
    
    const q = query(preguntasProfesorRef, where('timestamp', '>', new Date(Date.now() - 24 * 60 * 60 * 1000))); // Últimas 24 horas
    
    onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
            const lastQuestion = querySnapshot.docs[querySnapshot.docs.length - 1].data();
            preguntaProfesorElement.textContent = lastQuestion.pregunta;
        } else {
            preguntaProfesorElement.textContent = 'No hay preguntas recientes.';
        }
    });
}

// Función para contar respuestas
function contarRespuestas() {
    const totalSiElement = document.getElementById('totalSi');
    const totalNoElement = document.getElementById('totalNo');
    const siAlDiaElement = document.getElementById('siAlDia');
    const noAlDiaElement = document.getElementById('noAlDia');
    const siNoAlDiaElement = document.getElementById('siNoAlDia');
    const noNoAlDiaElement = document.getElementById('noNoAlDia');

    onSnapshot(respuestasAlumnoRef, (snapshot) => {
        let totalSi = 0;
        let totalNo = 0;
        let siAlDia = 0;
        let noAlDia = 0;
        let siNoAlDia = 0;
        let noNoAlDia = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.respuesta === 'Sí') totalSi++;
            if (data.respuesta === 'No') totalNo++;
            if (data.alDia) {
                if (data.respuesta === 'Sí') siAlDia++;
                if (data.respuesta === 'No') noAlDia++;
            } else {
                if (data.respuesta === 'Sí') siNoAlDia++;
                if (data.respuesta === 'No') noNoAlDia++;
            }
        });

        totalSiElement.textContent = totalSi;
        totalNoElement.textContent = totalNo;
        siAlDiaElement.textContent = siAlDia;
        noAlDiaElement.textContent = noAlDia;
        siNoAlDiaElement.textContent = siNoAlDia;
        noNoAlDiaElement.textContent = noNoAlDia;
    });
}

// Función para manejar el formulario de PIN
function verificarPin(event) {
    event.preventDefault();
    const pinInput = document.getElementById('pinInput').value;
    if (pinInput === CORRECT_PIN) {
        document.getElementById('pinPanel').style.display = 'none';
        mostrarPanel('profesor');
    } else {
        document.getElementById('pinError').style.display = 'block';
    }
}

// Función para mostrar el panel correspondiente
function mostrarPanel(panel) {
    const panels = ['inicio', 'pinPanel', 'alumnoPanel', 'profesorPanel'];
    panels.forEach(id => document.getElementById(id).classList.add('hidden'));

    if (panel === 'alumno') {
        document.getElementById('alumnoPanel').classList.remove('hidden');
        mostrarPreguntaProfesor();
    } else if (panel === 'pin') {
        document.getElementById('pinPanel').classList.remove('hidden');
    } else if (panel === 'profesor') {
        document.getElementById('profesorPanel').classList.remove('hidden');
        contarRespuestas();
        setInterval(contarRespuestas, 5000); // Actualizar cada 5 segundos
    }
}

// Función para guardar la respuesta del alumno
function guardarRespuestaAlumno(respuesta, alDia) {
    if (document.getElementById('preguntaInicial').classList.contains('hidden')) {
        // Ocultar la pregunta inicial y mostrar la pregunta del profesor
        document.getElementById('preguntaInicial').classList.add('hidden');
        document.getElementById('preguntaProfesorPanel').classList.remove('hidden');
        guardarRespuestaEnFirebase(respuesta, alDia);
    } else {
        guardarRespuestaEnFirebase(respuesta, alDia);
    }
}

// Agregar manejador de eventos para el formulario de PIN
document.getElementById('pinForm').addEventListener('submit', verificarPin);

// Manejo del formulario de la pregunta del profesor
document.getElementById('formPregunta').addEventListener('submit', (event) => {
    event.preventDefault();
    const pregunta = document.getElementById('preguntaInput').value;
    guardarPreguntaProfesor(pregunta);
    document.getElementById('preguntaInput').value = '';
});
