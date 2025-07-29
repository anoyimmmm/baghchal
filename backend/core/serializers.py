from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    win_rate = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id','display_name', 'username', 'games_played', 'wins', 'losses', 'win_rate']
        
    def get_win_rate(self, obj):
        return obj.win_rate()
    
    def get_display_name(self, obj):
        return obj.display_name()