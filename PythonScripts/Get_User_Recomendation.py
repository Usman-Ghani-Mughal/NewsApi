# Imports
import pandas as pd
import sys



def main():
    users_df = pd.read_csv('RecomendationFiles/user_recomendation.csv', converters={'antecedents': eval, 'consequents': eval}, index_col=0)
    username = sys.argv[1]
    user_label = users_df.loc[ username , 'consequents']
    print(user_label[0])

if __name__ == '__main__':
    main()