import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';


const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica'
    },
    header: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    date: {
        fontSize: 10,
        textAlign: 'right',
        marginBottom: 20
    },
    childInfo: {
        fontSize: 12,
        marginBottom: 15,
        lineHeight: 1.5
    },
    categoryTitle: {
        fontSize: 14,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 5,
        fontWeight: 'bold'
    },
    question: {
        fontSize: 12,
        marginBottom: 5,
        marginLeft: 10,
        lineHeight: 1.3
    },
    answer: {
        fontSize: 12,
        marginLeft: 20,
        marginBottom: 10
    },
    answerCan: {
        color: '#4CAF50' // Зеленый
    },
    answerPartial: {
        color: '#FFA500' // Оранжевый
    },
    answerUnknown: {
        color: '#808080' // Серый
    },
    comment: {
        fontSize: 11,
        marginLeft: 25,
        marginBottom: 10,
        color: '#555',
        fontStyle: 'italic'
    }
});

const ChildReportPDF = ({ childData, categories }) => {
    // Функция для стиля ответа
    const getAnswerStyle = (answer) => {
        const base = styles.answer;
        if (answer === 'Kann es') return [base, styles.answerCan];
        if (answer === 'Kann es teilweise') return [base, styles.answerPartial];
        return [base, styles.answerUnknown];
    };

    return (
        <Document>
            <Page style={styles.page}>
                {/* Заголовок и дата */}
                <Text style={styles.header}>
                    {childData?.name || 'Kind'}
                </Text>
                <Text style={styles.date}>
                    {format(new Date(), 'dd.MM.yyyy')}
                </Text>

                {/* Данные ребенка */}
                <View style={styles.childInfo}>
                    <Text>Geschlecht: {childData?.gender || '-'}</Text>
                    <Text>Geburtsjahr: {childData?.birthYear || '-'}</Text>
                    <Text>Gruppe: {childData?.group || '-'}</Text>
                    <Text>Altersklasse: {childData?.age || '-'}</Text>
                    <Text>Erzieher: {childData?.educator || '-'}</Text>
                </View>

                {/* Категории и вопросы */}
                {categories?.map(category => (
                    <View key={category.id} wrap={false}>
                        <Text style={styles.categoryTitle}>
                            {category.name?.toUpperCase()}
                        </Text>

                        {category.questions?.map((q, index) => (
                            <View key={q.id} wrap={false}>
                                {/* Вопрос */}
                                <Text style={styles.question}>
                                    {index + 1}. {q.text.replace(/@/g, '(at)')}
                                </Text>

                                {/* Ответ */}
                                <Text style={getAnswerStyle(q.answer)}>
                                    Antwort: {q.answer}
                                </Text>

                                {/* Комментарий (если есть) */}
                                {q.comment && (
                                    <Text style={styles.comment}>
                                        Kommentar: {q.comment}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                ))}
            </Page>
        </Document>
    );
};

export default ChildReportPDF;